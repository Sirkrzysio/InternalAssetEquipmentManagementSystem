

import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { LocationService } from '../../../core/services/location.service';
import { AuthService } from '../../../core/services/auth.service';
import { Location } from '../../../core/models';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-locations-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LoadingSpinnerComponent
  ],
  templateUrl: './locations-list.component.html',
  styleUrls: ['../locations-shared.styles.css', './locations-list.component.css']
})
export class LocationsListComponent implements OnInit {
  private readonly locationService = inject(LocationService);
  private readonly authService = inject(AuthService);
  private readonly fb = inject(FormBuilder);
  private readonly cdr = inject(ChangeDetectorRef);

  locations: Location[] = [];
  filteredLocations: Location[] = [];
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  // Form state
  showCreateForm = false;
  editingLocation: Location | null = null;
  isSubmitting = false;
  deletingLocation = '';

  // Search
  searchControl = new FormControl('');

  // Location form
  locationForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    address: [''],
    description: ['']
  });

  get canManage(): boolean {
    return this.authService.hasAnyRole(['Admin', 'Manager']);
  }

  get nameErrors(): string {
    const control = this.locationForm.get('name');
    if (control?.errors && control.touched) {
      if (control.errors['required']) return 'Nazwa lokalizacji jest wymagana';
      if (control.errors['minlength']) return 'Nazwa musi mieć co najmniej 2 znaki';
    }
    return '';
  }

  ngOnInit(): void {
    this.setupSearch();
    this.loadLocations();
  }

  private setupSearch(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe((searchTerm) => {
        this.filterLocations(searchTerm || '');
      });
  }

  private filterLocations(searchTerm: string): void {
    if (!searchTerm.trim()) {
      this.filteredLocations = [...this.locations];
      return;
    }

    const term = searchTerm.toLowerCase();
    this.filteredLocations = this.locations.filter(location =>
      location.name.toLowerCase().includes(term) ||
      (location.address && location.address.toLowerCase().includes(term)) ||
      (location.description && location.description.toLowerCase().includes(term))
    );
  }

  loadLocations(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.locationService.getAll().subscribe({
      next: (locations) => {
        this.locations = locations;
        this.filterLocations(this.searchControl.value || '');
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading locations:', error);
        this.errorMessage = 'Nie udało się załadować lokalizacji';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  editLocation(location: Location): void {
    this.editingLocation = location;
    this.locationForm.patchValue({
      name: location.name,
      address: location.address || '',
      description: location.description || ''
    });
  }

  cancelForm(): void {
    this.showCreateForm = false;
    this.editingLocation = null;
    this.locationForm.reset();
    this.isSubmitting = false;
  }

  onSubmit(): void {
    if (this.locationForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    const formValue = this.locationForm.value;
    const locationData = {
      name: formValue.name!,
      address: formValue.address || '',
      description: formValue.description || ''
    };

    const operation = this.editingLocation
      ? this.locationService.update(this.editingLocation.id, locationData)
      : this.locationService.create(locationData);

    operation.subscribe({
      next: () => {
        const action = this.editingLocation ? 'zaktualizowano' : 'dodano';
        this.successMessage = `Pomyślnie ${action} lokalizację "${locationData.name}"`;

        this.cancelForm();
        this.loadLocations();

        // Clear success message after 3 seconds
        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      },
      error: (error) => {
        console.error('Error saving location:', error);
        this.errorMessage = this.editingLocation
          ? 'Nie udało się zaktualizować lokalizacji'
          : 'Nie udało się dodać lokalizacji';
        this.isSubmitting = false;
      }
    });
  }

  deleteLocation(location: Location): void {
    const confirmed = confirm(
      `Czy na pewno chcesz usunąć lokalizację "${location.name}"?\n\n` +
      `Uwaga: Ta operacja może wpłynąć na przypisane aktywa.`
    );

    if (!confirmed) return;

    this.deletingLocation = location.id;

    this.locationService.delete(location.id).subscribe({
      next: () => {
        this.successMessage = `Pomyślnie usunięto lokalizację "${location.name}"`;
        this.loadLocations();
        this.deletingLocation = '';

        // Clear success message after 3 seconds
        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      },
      error: (error) => {
        console.error('Error deleting location:', error);
        this.errorMessage = 'Nie udało się usunąć lokalizacji. Może być używana przez aktywa.';
        this.deletingLocation = '';
      }
    });
  }

  private markFormGroupTouched(): void {
    Object.keys(this.locationForm.controls).forEach(key => {
      this.locationForm.get(key)?.markAsTouched();
    });
  }
}
