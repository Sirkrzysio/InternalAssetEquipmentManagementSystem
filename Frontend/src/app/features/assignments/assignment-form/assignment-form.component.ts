import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { AssignmentService } from '../../../core/services/assignment.service';
import { AssetService } from '../../../core/services/asset.service';
import { UserService } from '../../../core/services/user.service';
import { Asset, User, AssignmentType } from '../../../core/models';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-assignment-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    LoadingSpinnerComponent
  ],
  templateUrl: './assignment-form.component.html',
  styleUrls: ['../assignments-shared.styles.css', './assignment-form.component.css']
})
export class AssignmentFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly assignmentService = inject(AssignmentService);
  private readonly assetService = inject(AssetService);
  private readonly userService = inject(UserService);
  private readonly cdr = inject(ChangeDetectorRef);

  assignmentForm = this.fb.group({
    assetId: ['', [Validators.required]],
    userId: ['', [Validators.required]],
    type: ['', [Validators.required]],
    expectedReturnDate: [''],
    notes: ['']
  });

  availableAssets: Asset[] = [];
  users: User[] = [];
  selectedAsset: Asset | null = null;
  selectedUser: User | null = null;
  isLoading = true;
  isSubmitting = false;
  errorMessage = '';

  minReturnDate = new Date().toISOString().split('T')[0];

  assignmentTypes = [
    { label: 'Stałe', value: AssignmentType.Permanent },
    { label: 'Tymczasowe', value: AssignmentType.Temporary },
    { label: 'Wypożyczenie', value: AssignmentType.Loan }
  ];

  get assetIdErrors(): string {
    const control = this.assignmentForm.get('assetId');
    if (control?.errors && control.touched) {
      if (control.errors['required']) return 'Wybór sprzętu jest wymagany';
    }
    return '';
  }

  get userIdErrors(): string {
    const control = this.assignmentForm.get('userId');
    if (control?.errors && control.touched) {
      if (control.errors['required']) return 'Wybór użytkownika jest wymagany';
    }
    return '';
  }

  get typeErrors(): string {
    const control = this.assignmentForm.get('type');
    if (control?.errors && control.touched) {
      if (control.errors['required']) return 'Typ przypisania jest wymagany';
    }
    return '';
  }

  ngOnInit(): void {
    this.loadFormData();
  }

  private loadFormData(): void {
    this.isLoading = true;

    // Load both assets and users in parallel
    Promise.all([
      this.assetService.getAll().toPromise(),
      this.userService.getAll().toPromise()
    ]).then(([assets, users]) => {
      // Filter only available assets
      this.availableAssets = (assets || []).filter(asset => asset.status === 0); // Available status
      this.users = users || [];
      this.isLoading = false;
      this.cdr.detectChanges();
    }).catch((error) => {
      console.error('Error loading form data:', error);
      this.errorMessage = 'Nie udało się załadować danych formularza';
      this.isLoading = false;
    });
  }

  onAssetSelected(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const assetId = select.value;

    this.selectedAsset = this.availableAssets.find(asset => asset.id === assetId) || null;
  }

  onUserSelected(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const userId = select.value;

    this.selectedUser = this.users.find(user => user.id === userId) || null;
  }

  onSubmit(): void {
    if (this.assignmentForm.invalid) {
      this.markAllFieldsAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    const formValue = this.assignmentForm.value;

    const assignmentData = {
      assetId: formValue.assetId!,
      userId: formValue.userId!,
      type: Number(formValue.type!),
      expectedReturnDate: formValue.expectedReturnDate || undefined,
      notes: formValue.notes || undefined
    };

    this.assignmentService.create(assignmentData).subscribe({
      next: () => {
        this.router.navigate(['/assignments']);
      },
      error: (error) => {
        console.error('Error creating assignment:', error);
        this.errorMessage = 'Nie udało się utworzyć przypisania';
        this.isSubmitting = false;
      }
    });
  }

  private markAllFieldsAsTouched(): void {
    Object.keys(this.assignmentForm.controls).forEach(key => {
      this.assignmentForm.get(key)?.markAsTouched();
    });
  }
}
