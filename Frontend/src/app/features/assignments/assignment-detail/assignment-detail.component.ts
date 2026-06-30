import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { switchMap } from 'rxjs/operators';

import { AssignmentService } from '../../../core/services/assignment.service';
import { AuthService } from '../../../core/services/auth.service';
import { Assignment } from '../../../core/models';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { AssignmentTypePipe } from '../../../shared/pipes/assignment-type.pipe';

@Component({
  selector: 'app-assignment-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ConfirmDialogComponent,
    LoadingSpinnerComponent,
    AssignmentTypePipe
  ],
  templateUrl: './assignment-detail.component.html',
  styleUrls: [
    '../assignments-shared.styles.css',
    './assignment-detail.component.css',
    '../../../shared/styles/enterprise-detail.css'
  ]
})
export class AssignmentDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly assignmentService = inject(AssignmentService);
  private readonly authService = inject(AuthService);
  private readonly cdr = inject(ChangeDetectorRef);

  assignment: Assignment | null = null;
  isLoading = true;
  isReturning = false;
  showReturnConfirm = false;
  errorMessage = '';

  get canManage(): boolean {
    return this.authService.hasAnyRole(['Admin', 'Manager']);
  }

  ngOnInit(): void {
    const assignmentId = this.route.snapshot.paramMap.get('id');

    if (!assignmentId || assignmentId === 'null') {
      this.errorMessage = 'Nieprawidłowy identyfikator przypisania';
      this.isLoading = false;
      return;
    }

    this.isLoading = true;
    this.assignmentService.getById(assignmentId).subscribe({
      next: (assignment: Assignment) => {
        this.assignment = assignment;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading assignment:', error);
        this.errorMessage = 'Nie udało się załadować szczegółów przypisania';
        this.isLoading = false;
      }
    });
  }

  returnAsset(): void {
    if (!this.canManage || !this.assignment?.isActive) return;
    this.showReturnConfirm = true;
  }

  confirmReturnAsset(): void {
    if (!this.assignment) return;

    this.showReturnConfirm = false;
    this.isReturning = true;

    this.assignmentService.returnAsset(this.assignment.id).subscribe({
      next: () => {
        // Reload assignment to get updated data
        this.ngOnInit();
        this.isReturning = false;
      },
      error: (error) => {
        console.error('Error returning asset:', error);
        this.errorMessage = 'Nie udało się zwrócić sprzętu';
        this.isReturning = false;
      }
    });
  }

  cancelReturnAsset(): void {
    this.showReturnConfirm = false;
  }

  isOverdue(expectedReturnDate: string): boolean {
    const today = new Date();
    const returnDate = new Date(expectedReturnDate);
    return returnDate < today;
  }
}
