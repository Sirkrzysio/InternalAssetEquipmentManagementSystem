import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, startWith } from 'rxjs/operators';

import { AuditLogService } from '../../../core/services/audit-log.service';
import { AuthService } from '../../../core/services/auth.service';
import { AuditLog, PagedResult } from '../../../core/models';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-audit-logs-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LoadingSpinnerComponent
  ],
  templateUrl: './audit-logs-list.component.html',
  styleUrls: ['../audit-logs-shared.styles.css', './audit-logs-list.component.css']
})
export class AuditLogsListComponent implements OnInit {
  private readonly auditLogService = inject(AuditLogService);
  private readonly authService = inject(AuthService);
  private readonly cdr = inject(ChangeDetectorRef);

  auditLogs: AuditLog[] = [];
  pagedResult: PagedResult<AuditLog> = {
    items: [],
    totalCount: 0,
    page: 1,
    pageSize: 20,
    totalPages: 0,
    hasPreviousPage: false,
    hasNextPage: false
  };

  isLoading = false;
  errorMessage = '';

  // Filter controls
  entityNameFilter = new FormControl('');
  actionFilter = new FormControl('');
  dateFromFilter = new FormControl('');
  dateToFilter = new FormControl('');
  userEmailFilter = new FormControl('');

  maxDate = new Date().toISOString().split('T')[0];

  ngOnInit(): void {
    // Check if user has admin role
    if (!this.authService.hasRole('Admin')) {
      this.errorMessage = 'Brak uprawnień do przeglądania logów audytu';
      return;
    }

    this.setupFilters();
    this.loadAuditLogs();
  }

  private setupFilters(): void {
    // Auto-apply filters on user email change
    this.userEmailFilter.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe(() => {
        this.pagedResult.page = 1;
        this.loadAuditLogs();
      });
  }

  loadAuditLogs(): void {
    this.isLoading = true;
    this.errorMessage = '';

    const request = {
      page: this.pagedResult.page,
      pageSize: this.pagedResult.pageSize,
      searchTerm: this.userEmailFilter.value || undefined,
      entityName: this.entityNameFilter.value || undefined,
      action: this.actionFilter.value || undefined,
      dateFrom: this.dateFromFilter.value || undefined,
      dateTo: this.dateToFilter.value || undefined
    };

    this.auditLogService.getPaged(request).subscribe({
      next: (result) => {
        this.pagedResult = result;
        this.auditLogs = result.items;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading audit logs:', error);
        this.errorMessage = 'Nie udało się załadować logów audytu';
        this.auditLogs = [];
        this.pagedResult = {
          items: [],
          totalCount: 0,
          page: 1,
          pageSize: 20,
          totalPages: 0,
          hasPreviousPage: false,
          hasNextPage: false
        };
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  applyFilters(): void {
    this.pagedResult.page = 1;
    this.loadAuditLogs();
  }

  clearFilters(): void {
    this.entityNameFilter.setValue('');
    this.actionFilter.setValue('');
    this.dateFromFilter.setValue('');
    this.dateToFilter.setValue('');
    this.userEmailFilter.setValue('');
    this.applyFilters();
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.pagedResult.totalPages) {
      this.pagedResult.page = page;
      this.loadAuditLogs();
    }
  }

  getActionLabel(action: string): string {
    const labels: Record<string, string> = {
      'Create': 'Utworzenie',
      'Update': 'Aktualizacja',
      'Delete': 'Usunięcie',
      'Assign': 'Przypisanie',
      'Unassign': 'Odpięcie',
      'Login': 'Logowanie',
      'Logout': 'Wylogowanie'
    };
    return labels[action] || action;
  }

  getEntityLabel(entityName: string): string {
    const labels: Record<string, string> = {
      'Asset': 'Aktywo',
      'Assignment': 'Przypisanie',
      'User': 'Użytkownik',
      'Category': 'Kategoria',
      'Location': 'Lokalizacja'
    };
    return labels[entityName] || entityName;
  }

  formatChanges(changes: string): string {
    try {
      const parsed = JSON.parse(changes);
      return JSON.stringify(parsed, null, 2);
    } catch {
      return changes;
    }
  }
}
