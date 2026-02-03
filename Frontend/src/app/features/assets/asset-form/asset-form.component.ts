import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AssetService } from '../../../core/services/asset.service';
import { AuthService } from '../../../core/services/auth.service';
import { Asset, AssetStatus, Category, Location } from '../../../core/models';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-asset-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    LoadingSpinnerComponent
  ],
  templateUrl: './asset-form.component.html',
  styleUrls: ['../assets-shared.styles.css', './asset-form.component.css']
})
export class AssetFormComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private assetService = inject(AssetService);
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);

  assetForm!: FormGroup;
  isEditMode = false;
  isLoading = true;
  isSubmitting = false;
  errorMessage = '';
  AssetStatus = AssetStatus;

  assetId: string | null = null;

  public categories: Category[] = [];
  public locations: Location[] = [];

  constructor() {}

  ngOnInit(): void {
    this.assetId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.assetId;

    this.buildForm();

    if (this.isEditMode && this.assetId) {
      this.loadAsset(this.assetId);
    } else {
      this.isLoading = false;
    }
  }

  private buildForm(): void {
    this.assetForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      manufacturer: [''],
      model: [''],
      serialNumber: ['', Validators.required],
      categoryId: ['', Validators.required],
      locationId: [''],
      status: [AssetStatus.Available],
      purchasePrice: [0, [Validators.required, Validators.min(0)]],
      purchaseDate: ['', Validators.required],
      warrantyExpiration: ['']
    });
  }

  private loadAsset(id: string): void {
    this.isLoading = true;
    this.assetService.getById(id).subscribe({
      next: (asset: Asset) => {
        this.assetForm.patchValue(asset);
        this.isLoading = false;
        this.cdr.detectChanges(); // gwarantuje, że formularz się odświeży
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Nie udało się załadować danych aktywa';
        this.isLoading = false;
      }
    });
  }

  get nameErrors() {
    const ctrl = this.assetForm.get('name');
    return ctrl?.touched && ctrl.invalid ? 'Nazwa jest wymagana' : null;
  }

  get serialNumberErrors() {
    const ctrl = this.assetForm.get('serialNumber');
    return ctrl?.touched && ctrl.invalid ? 'Numer seryjny jest wymagany' : null;
  }

  get categoryIdErrors() {
    const ctrl = this.assetForm.get('categoryId');
    return ctrl?.touched && ctrl.invalid ? 'Kategoria jest wymagana' : null;
  }

  get purchasePriceErrors() {
    const ctrl = this.assetForm.get('purchasePrice');
    return ctrl?.touched && ctrl.invalid ? 'Cena zakupu jest wymagana i nie może być ujemna' : null;
  }

  get purchaseDateErrors() {
    const ctrl = this.assetForm.get('purchaseDate');
    return ctrl?.touched && ctrl.invalid ? 'Data zakupu jest wymagana' : null;
  }

  get canManage(): boolean {
    return this.authService.hasAnyRole(['Admin', 'Manager']);
  }

  onSubmit(): void {
    if (this.assetForm.invalid) return;

    this.isSubmitting = true;
    const assetData = this.assetForm.value;

    const request$ = this.isEditMode
      ? this.assetService.update(this.assetId!, assetData)
      : this.assetService.create(assetData);

    request$.subscribe({
      next: () => {
        this.isSubmitting = false;
        this.router.navigate(['/assets']);
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Nie udało się zapisać aktywa';
        this.isSubmitting = false;
      }
    });
  }

  onDelete(): void {
    if (!confirm('Czy na pewno chcesz usunąć to aktywo?')) return;
    if (!this.assetId) return;

    this.isSubmitting = true;
    this.assetService.delete(this.assetId).subscribe({
      next: () => this.router.navigate(['/assets']),
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Nie udało się usunąć aktywa';
        this.isSubmitting = false;
      }
    });
  }
}
