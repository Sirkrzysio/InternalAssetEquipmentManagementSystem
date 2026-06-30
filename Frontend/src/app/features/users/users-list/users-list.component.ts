import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { UserService } from '../../../core/services/user.service';
import { AuthService } from '../../../core/services/auth.service';
import { User, PagedResult, UserRole } from '../../../core/models';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    ConfirmDialogComponent,
    LoadingSpinnerComponent
  ],
  templateUrl: './users-list.component.html',
  styleUrls: ['../users-shared.styles.css', './users-list.component.css']
})
export class UsersListComponent implements OnInit {
  private readonly userService = inject(UserService);
  private readonly authService = inject(AuthService);
  private readonly cdr = inject(ChangeDetectorRef);

  users: User[] = [];
  pagedResult: PagedResult<User> = {
    items: [],
    totalCount: 0,
    page: 1,
    pageSize: 12,
    totalPages: 0,
    hasPreviousPage: false,
    hasNextPage: false
  };

  isLoading = false;
  selectedStatusFilter: 'all' | 'active' | 'inactive' = 'all';
  selectedRoleFilter: UserRole | 'all' = 'all';
  errorMessage = '';
  deactivatingUser = '';
  activatingUser = '';
  userPendingDeactivation: User | null = null;

  searchControl = new FormControl('');

  statusFilters = [
    { label: 'Wszyscy', value: 'all' as const },
    { label: 'Aktywni', value: 'active' as const },
    { label: 'Nieaktywni', value: 'inactive' as const }
  ];

  roleFilters = [
    { label: 'Wszystkie role', value: 'all' as const },
    { label: 'Administratorzy', value: UserRole.Admin },
    { label: 'Menedżerowie', value: UserRole.Manager },
    { label: 'Pracownicy', value: UserRole.Employee }
  ];

  get canManage(): boolean {
    return this.authService.hasAnyRole(['Admin', 'Manager']);
  }

  get currentUserId(): string {
    return this.authService.currentUser?.id || '';
  }

  ngOnInit(): void {
    this.setupSearch();
    this.loadUsers();
  }

  private setupSearch(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(() => {
        this.pagedResult.page = 1;
        this.loadUsers();
      });
  }

  loadUsers(): void {
    this.isLoading = true;

    const request = {
      page: this.pagedResult.page,
      pageSize: this.pagedResult.pageSize,
      searchTerm: this.searchControl.value || undefined,
      isActive: this.selectedStatusFilter === 'all' ? undefined : this.selectedStatusFilter === 'active',
      role: this.selectedRoleFilter === 'all' ? undefined : this.selectedRoleFilter
    };

    this.userService.getPaged(request).subscribe({
      next: (result) => {
        this.pagedResult = result;
        this.users = result.items;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.errorMessage = 'Nie udało się załadować użytkowników';
        this.users = [];
        this.pagedResult = {
          items: [],
          totalCount: 0,
          page: 1,
          pageSize: 12,
          totalPages: 0,
          hasPreviousPage: false,
          hasNextPage: false
        };
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  filterByStatus(status: 'all' | 'active' | 'inactive'): void {
    this.selectedStatusFilter = status;
    this.pagedResult.page = 1;
    this.loadUsers();
  }

  filterByRole(role: UserRole | 'all'): void {
    this.selectedRoleFilter = role;
    this.pagedResult.page = 1;
    this.loadUsers();
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.pagedResult.totalPages) {
      this.pagedResult.page = page;
      this.loadUsers();
    }
  }

  isCurrentUser(userId: string): boolean {
    return userId === this.currentUserId;
  }

  deactivateUser(user: User): void {
    if (!this.canManage || this.isCurrentUser(user.id)) return;
    this.userPendingDeactivation = user;
  }

  confirmDeactivateUser(): void {
    if (!this.userPendingDeactivation) return;

    const user = this.userPendingDeactivation;
    this.deactivatingUser = user.id;
    this.userPendingDeactivation = null;

    this.userService.deactivate(user.id).subscribe({
      next: () => {
        this.loadUsers(); // Reload to get updated data
        this.deactivatingUser = '';
      },
      error: (error) => {
        console.error('Error deactivating user:', error);
        this.errorMessage = 'Nie udało się dezaktywować użytkownika';
        this.deactivatingUser = '';
      }
    });
  }

  cancelDeactivateUser(): void {
    this.userPendingDeactivation = null;
  }

  activateUser(user: User): void {
    if (!this.canManage) return;

    this.activatingUser = user.id;

    this.userService.activate(user.id).subscribe({
      next: () => {
        this.loadUsers(); // Reload to get updated data
        this.activatingUser = '';
      },
      error: (error) => {
        console.error('Error activating user:', error);
        this.errorMessage = 'Nie udało się aktywować użytkownika';
        this.activatingUser = '';
      }
    });
  }
}
