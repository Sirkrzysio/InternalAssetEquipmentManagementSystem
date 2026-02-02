

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

export interface HeaderAction {
  label: string;
  icon?: string;
  class?: string;
  route?: string;
  action?: () => void;
  disabled?: boolean;
  hidden?: boolean;
}

export interface Breadcrumb {
  label: string;
  route?: string;
}

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <header class="page-header">
      <!-- Breadcrumbs -->
      <nav class="breadcrumbs" *ngIf="breadcrumbs && breadcrumbs.length > 0">
        <ol class="breadcrumb-list">
          <li *ngFor="let crumb of breadcrumbs; let last = last" class="breadcrumb-item">
            <a *ngIf="crumb.route && !last" [routerLink]="crumb.route" class="breadcrumb-link">
              {{ crumb.label }}
            </a>
            <span *ngIf="!crumb.route || last" class="breadcrumb-current">
              {{ crumb.label }}
            </span>
            <span *ngIf="!last" class="breadcrumb-separator">/</span>
          </li>
        </ol>
      </nav>

      <!-- Main Header Content -->
      <div class="header-content">
        <div class="header-left">
          <div class="header-icon" *ngIf="icon">
            <span>{{ icon }}</span>
          </div>
          <div class="header-text">
            <h1 class="page-title">{{ title }}</h1>
            <p *ngIf="subtitle" class="page-subtitle">{{ subtitle }}</p>
          </div>
        </div>

        <div class="header-right">
          <!-- Search Box -->
          <div class="search-container" *ngIf="showSearch">
            <input
              type="text"
              class="search-input"
              [placeholder]="searchPlaceholder"
              [(ngModel)]="searchValue"
              (input)="onSearchChange()"
            >
            <span class="search-icon">🔍</span>
          </div>

          <!-- Action Buttons -->
          <div class="actions" *ngIf="actions && actions.length > 0">
            <ng-container *ngFor="let action of actions">
              <a
                *ngIf="action.route && !action.hidden"
                [routerLink]="action.route"
                [class]="'btn ' + (action.class || 'btn-primary')"
                [attr.disabled]="action.disabled"
              >
                <span *ngIf="action.icon" class="btn-icon">{{ action.icon }}</span>
                {{ action.label }}
              </a>
              <button
                *ngIf="!action.route && !action.hidden"
                (click)="executeAction(action)"
                [class]="'btn ' + (action.class || 'btn-primary')"
                [disabled]="action.disabled"
              >
                <span *ngIf="action.icon" class="btn-icon">{{ action.icon }}</span>
                {{ action.label }}
              </button>
            </ng-container>
          </div>
        </div>
      </div>

      <!-- Stats/Metrics -->
      <div class="header-stats" *ngIf="stats && stats.length > 0">
        <div *ngFor="let stat of stats" class="stat-item">
          <div class="stat-value">{{ stat.value }}</div>
          <div class="stat-label">{{ stat.label }}</div>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .page-header {
      background: white;
      border-bottom: 1px solid #e9ecef;
      margin-bottom: 24px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .breadcrumbs {
      padding: 12px 24px;
      background-color: #f8f9fa;
      border-bottom: 1px solid #e9ecef;
    }

    .breadcrumb-list {
      display: flex;
      list-style: none;
      margin: 0;
      padding: 0;
      font-size: 14px;
    }

    .breadcrumb-item {
      display: flex;
      align-items: center;
    }

    .breadcrumb-link {
      color: #6c757d;
      text-decoration: none;
      transition: color 0.2s;
    }

    .breadcrumb-link:hover {
      color: #495057;
      text-decoration: underline;
    }

    .breadcrumb-current {
      color: #495057;
      font-weight: 500;
    }

    .breadcrumb-separator {
      margin: 0 8px;
      color: #adb5bd;
    }

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding: 24px;
      gap: 24px;
    }

    .header-left {
      display: flex;
      align-items: flex-start;
      gap: 16px;
      flex: 1;
    }

    .header-icon {
      font-size: 32px;
      line-height: 1;
      margin-top: 4px;
    }

    .header-text {
      flex: 1;
    }

    .page-title {
      font-size: 28px;
      font-weight: 600;
      color: #212529;
      margin: 0 0 8px 0;
      line-height: 1.2;
    }

    .page-subtitle {
      font-size: 16px;
      color: #6c757d;
      margin: 0;
      line-height: 1.4;
    }

    .header-right {
      display: flex;
      align-items: flex-start;
      gap: 16px;
      flex-shrink: 0;
    }

    .search-container {
      position: relative;
      min-width: 280px;
    }

    .search-input {
      width: 100%;
      padding: 10px 40px 10px 12px;
      border: 1px solid #ced4da;
      border-radius: 6px;
      font-size: 14px;
      transition: border-color 0.2s, box-shadow 0.2s;
    }

    .search-input:focus {
      outline: none;
      border-color: #80bdff;
      box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
    }

    .search-icon {
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
      color: #6c757d;
      pointer-events: none;
    }

    .actions {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 10px 16px;
      border: none;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 500;
      text-decoration: none;
      cursor: pointer;
      transition: all 0.2s;
      white-space: nowrap;
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .btn-primary {
      background-color: #0d6efd;
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background-color: #0b5ed7;
    }

    .btn-secondary {
      background-color: #6c757d;
      color: white;
    }

    .btn-secondary:hover:not(:disabled) {
      background-color: #5c636a;
    }

    .btn-outline {
      background-color: transparent;
      color: #0d6efd;
      border: 1px solid #0d6efd;
    }

    .btn-outline:hover:not(:disabled) {
      background-color: #0d6efd;
      color: white;
    }

    .btn-success {
      background-color: #198754;
      color: white;
    }

    .btn-success:hover:not(:disabled) {
      background-color: #157347;
    }

    .btn-danger {
      background-color: #dc3545;
      color: white;
    }

    .btn-danger:hover:not(:disabled) {
      background-color: #bb2d3b;
    }

    .btn-icon {
      font-size: 16px;
    }

    .header-stats {
      display: flex;
      gap: 32px;
      padding: 16px 24px;
      background-color: #f8f9fa;
      border-top: 1px solid #e9ecef;
    }

    .stat-item {
      text-align: center;
    }

    .stat-value {
      font-size: 24px;
      font-weight: 700;
      color: #495057;
      line-height: 1;
    }

    .stat-label {
      font-size: 12px;
      color: #6c757d;
      text-transform: uppercase;
      font-weight: 500;
      margin-top: 4px;
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .header-content {
        flex-direction: column;
        align-items: stretch;
        gap: 16px;
      }

      .header-right {
        flex-direction: column;
        align-items: stretch;
      }

      .search-container {
        min-width: auto;
      }

      .actions {
        justify-content: flex-end;
      }

      .header-stats {
        flex-wrap: wrap;
        gap: 16px;
      }

      .page-title {
        font-size: 24px;
      }
    }
  `]
})
export class PageHeaderComponent {
  @Input() title = '';
  @Input() subtitle = '';
  @Input() icon = '';
  @Input() breadcrumbs: Breadcrumb[] = [];
  @Input() actions: HeaderAction[] = [];
  @Input() showSearch = false;
  @Input() searchPlaceholder = 'Szukaj...';
  @Input() stats: { label: string; value: string | number }[] = [];

  @Output() search = new EventEmitter<string>();

  searchValue = '';

  onSearchChange(): void {
    this.search.emit(this.searchValue);
  }

  executeAction(action: HeaderAction): void {
    if (action.action && !action.disabled) {
      action.action();
    }
  }
}
