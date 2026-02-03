// DASHBOARD COMPONENT - Main Overview
import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService, AssetService, UserService, AssignmentService } from '../../core';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, LoadingSpinnerComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly assetService = inject(AssetService);
  private readonly userService = inject(UserService);
  private readonly assignmentService = inject(AssignmentService);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  currentUser = this.authService.currentUser;
  isLoading = true;

  stats = {
    totalAssets: 0,
    activeAssignments: 0,
    totalUsers: 0,
    availableAssets: 0
  };

  get canManageUsers(): boolean {
    return this.authService.hasAnyRole(['Admin', 'Manager']);
  }

  get canViewAudit(): boolean {
    return this.authService.hasRole('Admin');
  }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    // In a real app, you'd have a dashboard service that aggregates this data
    this.isLoading = false;
    this.stats = {
      totalAssets: 125,
      activeAssignments: 78,
      totalUsers: 45,
      availableAssets: 47
    };
  }


  navigate(route: string): void {
    this.router.navigate([route]);
  }
}
