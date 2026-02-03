import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { switchMap, timeout, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

import { UserService } from '../../../core/services/user.service';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../core/models';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    LoadingSpinnerComponent
  ],
  templateUrl: './user-detail.component.html',
  styleUrls: ['../users-shared.styles.css', './user-detail.component.css']
})
export class UserDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly userService = inject(UserService);
  private readonly authService = inject(AuthService);
  private readonly cdr = inject(ChangeDetectorRef);

  user: User | null = null;
  isLoading = true;
  isDeactivating = false;
  isActivating = false;
  errorMessage = '';

  get canManage(): boolean {
    return this.authService.hasAnyRole(['Admin', 'Manager']);
  }

  get isCurrentUser(): boolean {
    return this.user?.id === this.authService.currentUser?.id;
  }

  ngOnInit(): void {
    const userId = this.route.snapshot.paramMap.get('id');

    if (!userId || userId === 'null') {
      this.errorMessage = 'Nieprawidłowy identyfikator użytkownika';
      this.isLoading = false;
      return;
    }

    this.isLoading = true;
    this.userService.getById(userId).subscribe({
      next: (user: User) => {
        this.user = user;
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

  hasPermission(permission: string): boolean {
    if (!this.user) return false;

    // Define permissions based on role
    const permissions = {
      'view_assets': ['Admin', 'Manager', 'Employee'],
      'manage_assets': ['Admin', 'Manager'],
      'manage_users': ['Admin', 'Manager'],
      'view_audit': ['Admin']
    };

    const allowedRoles = permissions[permission as keyof typeof permissions] || [];
    return allowedRoles.includes(this.user.roleName);
  }

  deactivateUser(): void {
    if (!this.canManage || !this.user || this.isCurrentUser) return;

    const confirmed = confirm(
      `Czy na pewno chcesz dezaktywować użytkownika "${this.user.fullName}"?\n\n` +
      `Użytkownik nie będzie mógł się logować do systemu.`
    );

    if (!confirmed) return;

    this.isDeactivating = true;

    this.userService.deactivate(this.user.id).pipe(
      timeout(10000),
      catchError(error => {
        console.error('❌ Deactivate Error:', error);
        return of(null);
      })
    ).subscribe({
      next: (result) => {
        if (result !== null) {
          this.reloadUser();
        } else {
          this.errorMessage = 'Nie udało się dezaktywować użytkownika';
        }
        this.isDeactivating = false;
      },
      error: (error) => {
        console.error('Error deactivating user:', error);
        if (error.name === 'TimeoutError') {
          this.errorMessage = 'Przekroczono limit czasu podczas dezaktywacji.';
        } else {
          this.errorMessage = 'Nie udało się dezaktywować użytkownika';
        }
        this.isDeactivating = false;
      }
    });
  }

  activateUser(): void {
    if (!this.canManage || !this.user) return;

    this.isActivating = true;

    this.userService.activate(this.user.id).pipe(
      timeout(10000),
      catchError(error => {
        console.error('❌ Activate Error:', error);
        return of(null);
      })
    ).subscribe({
      next: (result) => {
        if (result !== null) {
          this.reloadUser();
        } else {
          this.errorMessage = 'Nie udało się aktywować użytkownika';
        }
        this.isActivating = false;
      },
      error: (error) => {
        console.error('Error activating user:', error);
        if (error.name === 'TimeoutError') {
          this.errorMessage = 'Przekroczono limit czasu podczas aktywacji.';
        } else {
          this.errorMessage = 'Nie udało się aktywować użytkownika';
        }
        this.isActivating = false;
      }
    });
  }

  private reloadUser(): void {
    if (!this.user?.id) return;

    console.log('🔄 Reloading user with ID:', this.user.id); // Debug log

    this.userService.getById(this.user.id).pipe(
      timeout(10000), // 10 second timeout
      catchError(error => {
        console.error('❌ Reload API Error:', error);
        return of(null);
      })
    ).subscribe({
      next: (user) => {
        console.log('✅ User reloaded:', user); // Debug log
        if (user) {
          this.user = user;
          this.errorMessage = '';
        } else {
          this.errorMessage = 'Nie udało się odświeżyć danych użytkownika';
        }
      },
      error: (error) => {
        console.error('❌ Error reloading user:', error);

        if (error.name === 'TimeoutError') {
          this.errorMessage = 'Przekroczono limit czasu podczas odświeżania danych.';
        } else if (error.status === 0) {
          this.errorMessage = 'Brak połączenia z serwerem podczas odświeżania.';
        } else {
          this.errorMessage = 'Nie udało się odświeżyć danych użytkownika';
        }
      }
    });
  }
}
