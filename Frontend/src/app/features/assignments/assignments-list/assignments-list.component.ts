import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, startWith } from 'rxjs/operators';

import { AssignmentService } from '../../../core/services/assignment.service';
import { AuthService } from '../../../core/services/auth.service';
import { Assignment, PagedResult } from '../../../core/models';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { AssignmentTypePipe } from '../../../shared/pipes/assignment-type.pipe';

@Component({
  selector: 'app-assignments-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    ConfirmDialogComponent,
    LoadingSpinnerComponent,
    AssignmentTypePipe
  ],
  templateUrl: './assignments-list.component.html',
  styleUrls: ['../assignments-shared.styles.css', './assignments-list.component.css']
})
export class AssignmentsListComponent implements OnInit {
  private readonly assignmentService = inject(AssignmentService);
  private readonly authService = inject(AuthService);
  private readonly cdr = inject(ChangeDetectorRef);

  assignments: Assignment[] = [];
  pagedResult: PagedResult<Assignment> = {
    items: [],
    totalCount: 0,
    page: 1,
    pageSize: 12,
    totalPages: 0,
    hasPreviousPage: false,
    hasNextPage: false
  };

  isLoading = false;
  selectedStatusFilter: 'all' | 'active' | 'returned' = 'all';
  errorMessage = '';
  returningAsset = '';
  assignmentPendingReturn: Assignment | null = null;

  searchControl = new FormControl('');

  statusFilters = [
    { label: 'Wszystkie', value: 'all' as const },
    { label: 'Aktywne', value: 'active' as const },
    { label: 'Zakończone', value: 'returned' as const }
  ];

  get canManage(): boolean {
    return this.authService.hasAnyRole(['Admin', 'Manager']);
  }

  ngOnInit(): void {
    this.setupSearch();
    this.loadAssignments();
  }

  private setupSearch(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(() => {
        this.pagedResult.page = 1;
        this.loadAssignments();
      });
  }

  loadAssignments(): void {
    this.isLoading = true;
    this.errorMessage = '';

    const request = {
      page: this.pagedResult.page,
      pageSize: this.pagedResult.pageSize,
      searchTerm: this.searchControl.value || undefined,
      isActive: this.selectedStatusFilter === 'all' ? undefined : this.selectedStatusFilter === 'active'
    };

    this.assignmentService.getPaged(request).subscribe({
      next: (result) => {
        this.pagedResult = result;
        this.assignments = result.items;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading assignments:', error);
        this.errorMessage = 'Nie udało się załadować przypisań';
        this.assignments = [];
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

  filterByStatus(status: 'all' | 'active' | 'returned'): void {
    this.selectedStatusFilter = status;
    this.pagedResult.page = 1;
    this.loadAssignments();
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.pagedResult.totalPages) {
      this.pagedResult.page = page;
      this.loadAssignments();
    }
  }

  returnAsset(assignment: Assignment): void {
    if (!this.canManage) return;
    this.assignmentPendingReturn = assignment;
  }

  confirmReturnAsset(): void {
    if (!this.assignmentPendingReturn) return;

    const assignment = this.assignmentPendingReturn;
    this.returningAsset = assignment.id;
    this.assignmentPendingReturn = null;

    this.assignmentService.returnAsset(assignment.id).subscribe({
      next: () => {
        this.loadAssignments(); // Reload to get updated data
        this.returningAsset = '';
      },
      error: (error) => {
        console.error('Error returning asset:', error);
        this.errorMessage = 'Nie udało się zwrócić sprzętu';
        this.returningAsset = '';
      }
    });
  }

  cancelReturnAsset(): void {
    this.assignmentPendingReturn = null;
  }

  isOverdue(expectedReturnDate: string): boolean {
    const today = new Date();
    const returnDate = new Date(expectedReturnDate);
    return returnDate < today;
  }
}
