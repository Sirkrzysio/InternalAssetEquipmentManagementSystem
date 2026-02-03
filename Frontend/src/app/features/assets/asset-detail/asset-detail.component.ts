import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { finalize, tap } from 'rxjs/operators';
import { EMPTY } from 'rxjs';

import { AssetService } from '../../../core/services/asset.service';
import { AssignmentService } from '../../../core/services/assignment.service';
import { AuditLogService } from '../../../core/services/audit-log.service';
import { AuthService } from '../../../core/services/auth.service';
import { Asset, Assignment, AuditLog } from '../../../core/models';
import { AssetStatusPipe } from '../../../shared/pipes/asset-status.pipe';
import { AssignmentTypePipe } from '../../../shared/pipes/assignment-type.pipe';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-asset-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    AssetStatusPipe,
    AssignmentTypePipe,
    LoadingSpinnerComponent
  ],
  templateUrl: './asset-detail.component.html',
  styleUrls: ['../assets-shared.styles.css', './asset-detail.component.css']
})
export class AssetDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly assetService = inject(AssetService);
  private readonly assignmentService = inject(AssignmentService);
  private readonly auditLogService = inject(AuditLogService);
  private readonly authService = inject(AuthService);
  private readonly cdr = inject(ChangeDetectorRef);

  asset: Asset | null = null;
  assignments: Assignment[] = [];
  auditLogs: AuditLog[] = [];

  isLoading = true;
  assignmentsLoading = false;
  auditLoading = false;
  errorMessage = '';

  get canManage(): boolean {
    return this.authService.hasAnyRole(['Admin', 'Manager']);
  }

  get canViewAudit(): boolean {
    return this.authService.hasRole('Admin');
  }

  ngOnInit(): void {
    const assetId = this.route.snapshot.paramMap.get('id');

    if (!assetId || assetId === 'null') {
      this.errorMessage = 'Nieprawidłowy identyfikator aktywa';
      this.isLoading = false;
      return;
    }

    this.isLoading = true;
    this.assetService.getById(assetId).subscribe({
      next: (asset: Asset) => {
        this.asset = asset;
        this.isLoading = false;
        this.cdr.detectChanges(); // Force refresh

        if (asset) {
          this.loadAssignments(asset.id);
          if (this.canViewAudit) {
            this.loadAuditLogs(asset.id);
          }
        }
      },
      error: (error) => {
        console.error('Error loading asset:', error);
        this.errorMessage = 'Nie udało się załadować szczegółów aktywa';
        this.isLoading = false;
      }
    });
  }


  private loadAssignments(assetId: string): void {
    this.assignmentsLoading = true;

    this.assignmentService.getByAssetId(assetId).pipe(
      finalize(() => this.assignmentsLoading = false)
    ).subscribe({
      next: (assignments) => {
        this.assignments = assignments;
      },
      error: (error) => {
        console.error('❌ Error loading assignments:', error);
      }
    });
  }

  private loadAuditLogs(assetId: string): void {
    this.auditLoading = true;

    this.auditLogService.getByEntity('Asset', assetId).pipe(
      finalize(() => this.auditLoading = false)
    ).subscribe({
      next: (logs) => {
        this.auditLogs = logs;
      },
      error: (error) => {
        console.error('❌ Error loading audit logs:', error);
      }
    });
  }
}
