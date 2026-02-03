
import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { switchMap, of } from 'rxjs';

import { LocationService } from '../../../core/services/location.service';
import { Location } from '../../../core/models';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-location-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    LoadingSpinnerComponent
  ],
  templateUrl: './location-form.component.html',
  styleUrls: ['../locations-shared.styles.css', './location-form.component.css']
})
export class LocationFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly locationService = inject(LocationService);
  private readonly cdr = inject(ChangeDetectorRef);

  locationForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    description: [''],
    building: [''],
    floor: [''],
    room: [''],
    address: ['']
  });

  isEditMode = false;
  isLoading = true;
  isSubmitting = false;
  errorMessage = '';
  locationId = '';

  get nameErrors(): string {
    const control = this.locationForm.get('name');
    if (control?.errors && control.touched) {
      if (control.errors['required']) return 'Nazwa lokalizacji jest wymagana';
      if (control.errors['minlength']) return 'Nazwa musi mieć co najmniej 2 znaki';
    }
    return '';
  }

  ngOnInit(): void {
    const locationId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!locationId;
    this.locationId = locationId || '';

    if (this.isEditMode && locationId) {
      this.loadLocation(locationId);
    } else {
      this.isLoading = false;
    }
  }

  private loadLocation(id: string): void {
    this.isLoading = true;
    this.locationService.getById(id).subscribe({
      next: (location: Location) => {
        this.populateForm(location);
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading location:', error);
        this.errorMessage = 'Nie udało się załadować danych lokalizacji';
        this.isLoading = false;
      }
    });
  }

  private populateForm(location: Location): void {
    this.locationForm.patchValue({
      name: location.name,
      description: location.description || '',
      building: location.building || '',
      floor: location.floor || '',
      room: location.room || '',
      address: location.address || ''
    });
  }

  onSubmit(): void {
    if (this.locationForm.invalid) {
      this.markAllFieldsAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    const formValue = this.locationForm.value;
    const locationData = {
      name: formValue.name!,
      description: formValue.description || '',
      building: formValue.building || '',
      floor: formValue.floor || '',
      room: formValue.room || '',
      address: formValue.address || ''
    };

    const operation = this.isEditMode
      ? this.locationService.update(this.locationId, locationData)
      : this.locationService.create(locationData);

    operation.subscribe({
      next: () => {
        this.router.navigate(['/locations']);
      },
      error: (error) => {
        console.error('Error saving location:', error);
        this.errorMessage = this.isEditMode
          ? 'Nie udało się zaktualizować lokalizacji'
          : 'Nie udało się dodać lokalizacji';
        this.isSubmitting = false;
      }
    });
  }

  private markAllFieldsAsTouched(): void {
    Object.keys(this.locationForm.controls).forEach(key => {
      this.locationForm.get(key)?.markAsTouched();
    });
  }
}
