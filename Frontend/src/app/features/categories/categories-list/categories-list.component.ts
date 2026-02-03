import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, startWith } from 'rxjs/operators';

import { CategoryService } from '../../../core/services/category.service';
import { AuthService } from '../../../core/services/auth.service';
import { Category } from '../../../core/models';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-categories-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LoadingSpinnerComponent
  ],
  templateUrl: './categories-list.component.html',
  styleUrls: ['../categories-shared.styles.css', './categories-list.component.css']
})
export class CategoriesListComponent implements OnInit {
  private readonly categoryService = inject(CategoryService);
  private readonly authService = inject(AuthService);
  private readonly fb = inject(FormBuilder);
  private readonly cdr = inject(ChangeDetectorRef);

  categories: Category[] = [];
  filteredCategories: Category[] = [];
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  // Form state
  showCreateForm = false;
  editingCategory: Category | null = null;
  isSubmitting = false;
  deletingCategory = '';

  // Search
  searchControl = new FormControl('');

  // Category form
  categoryForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    description: ['']
  });

  get canManage(): boolean {
    return this.authService.hasAnyRole(['Admin', 'Manager']);
  }

  get nameErrors(): string {
    const control = this.categoryForm.get('name');
    if (control?.errors && control.touched) {
      if (control.errors['required']) return 'Nazwa kategorii jest wymagana';
      if (control.errors['minlength']) return 'Nazwa musi mieć co najmniej 2 znaki';
    }
    return '';
  }

  ngOnInit(): void {
    this.setupSearch();
    this.loadCategories();
  }

  private setupSearch(): void {
    this.searchControl.valueChanges
      .pipe(
        startWith(''),
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe((searchTerm) => {
        this.filterCategories(searchTerm || '');
      });
  }

  private filterCategories(searchTerm: string): void {
    if (!searchTerm.trim()) {
      this.filteredCategories = [...this.categories];
      return;
    }

    const term = searchTerm.toLowerCase();
    this.filteredCategories = this.categories.filter(category =>
      category.name.toLowerCase().includes(term) ||
      (category.description && category.description.toLowerCase().includes(term))
    );
  }

  loadCategories(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.categoryService.getAll().subscribe({
      next: (categories) => {
        this.categories = categories;
        this.filterCategories(this.searchControl.value || '');
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.errorMessage = 'Nie udało się załadować kategorii';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  editCategory(category: Category): void {
    this.editingCategory = category;
    this.categoryForm.patchValue({
      name: category.name,
      description: category.description || ''
    });
  }

  cancelForm(): void {
    this.showCreateForm = false;
    this.editingCategory = null;
    this.categoryForm.reset();
    this.isSubmitting = false;
  }

  onSubmit(): void {
    if (this.categoryForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    const formValue = this.categoryForm.value;
    const categoryData = {
      name: formValue.name!,
      description: formValue.description || ''
    };

    const operation = this.editingCategory
      ? this.categoryService.update(this.editingCategory.id, categoryData)
      : this.categoryService.create(categoryData);

    operation.subscribe({
      next: () => {
        const action = this.editingCategory ? 'zaktualizowano' : 'dodano';
        this.successMessage = `Pomyślnie ${action} kategorię "${categoryData.name}"`;

        this.cancelForm();
        this.loadCategories();

        // Clear success message after 3 seconds
        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      },
      error: (error) => {
        console.error('Error saving category:', error);
        this.errorMessage = this.editingCategory
          ? 'Nie udało się zaktualizować kategorii'
          : 'Nie udało się dodać kategorii';
        this.isSubmitting = false;
      }
    });
  }

  deleteCategory(category: Category): void {
    const confirmed = confirm(
      `Czy na pewno chcesz usunąć kategorię "${category.name}"?\n\n` +
      `Uwaga: Ta operacja może wpłynąć na przypisane aktywa.`
    );

    if (!confirmed) return;

    this.deletingCategory = category.id;

    this.categoryService.delete(category.id).subscribe({
      next: () => {
        this.successMessage = `Pomyślnie usunięto kategorię "${category.name}"`;
        this.loadCategories();
        this.deletingCategory = '';

        // Clear success message after 3 seconds
        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      },
      error: (error) => {
        console.error('Error deleting category:', error);
        this.errorMessage = 'Nie udało się usunąć kategorii. Może być używana przez aktywa.';
        this.deletingCategory = '';
      }
    });
  }

  private markFormGroupTouched(): void {
    Object.keys(this.categoryForm.controls).forEach(key => {
      this.categoryForm.get(key)?.markAsTouched();
    });
  }
}
