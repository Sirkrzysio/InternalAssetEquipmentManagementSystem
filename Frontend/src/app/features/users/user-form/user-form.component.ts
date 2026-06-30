
import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { of } from 'rxjs';

import { UserService } from '../../../core/services/user.service';
import { CreateUserRequest, UpdateUserRequest, User, UserRole } from '../../../core/models';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    LoadingSpinnerComponent
  ],
  templateUrl: './user-form.component.html',
  styleUrls: [
    '../users-shared.styles.css',
    './user-form.component.css',
    '../../../shared/styles/enterprise-form.css'
  ]
})
export class UserFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly userService = inject(UserService);
  private readonly cdr = inject(ChangeDetectorRef);

  userForm = this.fb.group({
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: [''], // Will be required only for create mode
    phoneNumber: [''],
    department: [''],
    role: ['', [Validators.required]]
  });

  UserRole = UserRole; // Export to template

  isEditMode = false;
  isLoading = true;
  isSubmitting = false;
  errorMessage = '';
  userId = '';

  get firstNameErrors(): string {
    const control = this.userForm.get('firstName');
    if (control?.errors && control.touched) {
      if (control.errors['required']) return 'Imię jest wymagane';
      if (control.errors['minlength']) return 'Imię musi mieć co najmniej 2 znaki';
    }
    return '';
  }

  get lastNameErrors(): string {
    const control = this.userForm.get('lastName');
    if (control?.errors && control.touched) {
      if (control.errors['required']) return 'Nazwisko jest wymagane';
      if (control.errors['minlength']) return 'Nazwisko musi mieć co najmniej 2 znaki';
    }
    return '';
  }

  get emailErrors(): string {
    const control = this.userForm.get('email');
    if (control?.errors && control.touched) {
      if (control.errors['required']) return 'Email jest wymagany';
      if (control.errors['email']) return 'Nieprawidłowy format email';
    }
    return '';
  }

  get passwordErrors(): string {
    const control = this.userForm.get('password');
    if (control?.errors && control.touched) {
      if (control.errors['required']) return 'Hasło jest wymagane';
      if (control.errors['minlength']) return 'Hasło musi mieć co najmniej 6 znaków';
    }
    return '';
  }

  get roleErrors(): string {
    const control = this.userForm.get('role');
    if (control?.errors && control.touched) {
      if (control.errors['required']) return 'Wybór roli jest wymagany';
    }
    return '';
  }

  ngOnInit(): void {
    const userId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!userId;
    this.userId = userId || '';

    if (this.isEditMode && userId) {
      this.loadUser(userId);
    } else {
      this.isLoading = false;
      this.setupFormForCreate();
    }
  }

  private loadUser(id: string): void {
    this.isLoading = true;
    this.userService.getById(id).subscribe({
      next: (user: User) => {
        this.populateForm(user);
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading user:', error);
        this.errorMessage = 'Nie udało się załadować danych użytkownika';
        this.isLoading = false;
      }
    });
  }

  private setupFormForCreate(): void {
    // Add password validation for create mode
    this.userForm.get('password')?.setValidators([
      Validators.required,
      Validators.minLength(6)
    ]);
    this.userForm.get('password')?.updateValueAndValidity();
  }

  private populateForm(user: User): void {
    this.userForm.patchValue({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber || '',
      department: user.department || '',
      role: user.role.toString()
    });
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      this.markAllFieldsAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    const formValue = this.userForm.value;
    const role = Number(formValue.role!) as UserRole;

    if (this.isEditMode) {
      const userData: UpdateUserRequest = {
        firstName: formValue.firstName!,
        lastName: formValue.lastName!,
        email: formValue.email!,
        phoneNumber: formValue.phoneNumber || undefined,
        department: formValue.department || undefined,
        role
      };

      this.userService.update(this.userId, userData).subscribe({
        next: () => {
          this.router.navigate(['/users']);
        },
        error: (error) => {
          console.error('Error saving user:', error);
          this.errorMessage = 'Nie udało się zaktualizować użytkownika';
          this.isSubmitting = false;
        }
      });

      return;
    }

    const userData: CreateUserRequest = {
      firstName: formValue.firstName!,
      lastName: formValue.lastName!,
      email: formValue.email!,
      password: formValue.password!,
      phoneNumber: formValue.phoneNumber || undefined,
      department: formValue.department || undefined,
      role
    };

    this.userService.create(userData).subscribe({
      next: () => {
        this.router.navigate(['/users']);
      },
      error: (error) => {
        console.error('Error saving user:', error);
        this.errorMessage = 'Nie udało się dodać użytkownika';
        this.isSubmitting = false;
      }
    });
  }

  private markAllFieldsAsTouched(): void {
    Object.keys(this.userForm.controls).forEach(key => {
      this.userForm.get(key)?.markAsTouched();
    });
  }
}
