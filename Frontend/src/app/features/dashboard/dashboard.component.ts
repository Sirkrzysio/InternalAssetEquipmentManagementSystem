
// DASHBOARD COMPONENT - Main Overview


import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService, AssetService, UserService, AssignmentService } from '../../core';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, LoadingSpinnerComponent],
  template: `
    <div class="dashboard">
      <header class="dashboard-header">
        <h1>Panel Główny</h1>
        <div class="user-info">
          <span>Witaj, {{ currentUser?.fullName }}</span>
          <button (click)="logout()" class="logout-btn">Wyloguj</button>
        </div>
      </header>

      <div class="dashboard-content" *ngIf="!isLoading; else loading">
        <div class="stats-grid">
          <div class="stat-card">
            <h3>Aktywa</h3>
            <div class="stat-number">{{ stats.totalAssets }}</div>
            <div class="stat-label">Łącznie aktywów</div>
          </div>
          <div class="stat-card">
            <h3>Przypisania</h3>
            <div class="stat-number">{{ stats.activeAssignments }}</div>
            <div class="stat-label">Aktywne przypisania</div>
          </div>
          <div class="stat-card">
            <h3>Użytkownicy</h3>
            <div class="stat-number">{{ stats.totalUsers }}</div>
            <div class="stat-label">Zarejestrowani użytkownicy</div>
          </div>
          <div class="stat-card">
            <h3>Dostępne</h3>
            <div class="stat-number">{{ stats.availableAssets }}</div>
            <div class="stat-label">Dostępne aktywa</div>
          </div>
        </div>

        <div class="quick-actions">
          <h2>Szybkie akcje</h2>
          <div class="actions-grid">
            <button (click)="navigate('/assets')" class="action-btn">
              <span>📦</span>
              <div>Zarządzaj aktywami</div>
            </button>
            <button (click)="navigate('/assignments')" class="action-btn">
              <span>📋</span>
              <div>Przypisania</div>
            </button>
            <button *ngIf="canManageUsers" (click)="navigate('/users')" class="action-btn">
              <span>👥</span>
              <div>Użytkownicy</div>
            </button>
            <button *ngIf="canViewAudit" (click)="navigate('/audit-logs')" class="action-btn">
              <span>📊</span>
              <div>Logi audytu</div>
            </button>
          </div>
        </div>
      </div>

      <ng-template #loading>
        <app-loading-spinner message="Ładowanie danych..."></app-loading-spinner>
      </ng-template>
    </div>
  `,
  styles: [`
    .dashboard {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .dashboard-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 1px solid #eee;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 20px;
    }

    .logout-btn {
      padding: 8px 16px;
      background-color: #e74c3c;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 40px;
    }

    .stat-card {
      background: white;
      padding: 24px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      text-align: center;
    }

    .stat-number {
      font-size: 48px;
      font-weight: bold;
      color: #3498db;
      margin: 10px 0;
    }

    .stat-label {
      color: #666;
      font-size: 14px;
    }

    .quick-actions {
      background: white;
      padding: 24px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      margin-top: 20px;
    }

    .action-btn {
      padding: 20px;
      border: 1px solid #ddd;
      border-radius: 8px;
      background: #f8f9fa;
      cursor: pointer;
      transition: all 0.3s;
      text-align: center;
    }

    .action-btn:hover {
      background: #e9ecef;
      transform: translateY(-2px);
    }

    .action-btn span {
      font-size: 24px;
      display: block;
      margin-bottom: 8px;
    }
  `]
})
export class DashboardComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly assetService = inject(AssetService);
  private readonly userService = inject(UserService);
  private readonly assignmentService = inject(AssignmentService);
  private readonly router = inject(Router);

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

  logout(): void {
    this.authService.logout().subscribe();
  }

  navigate(route: string): void {
    this.router.navigate([route]);
  }
}
