

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, startWith } from 'rxjs/operators';

import { AssetService } from '../../../core/services/asset.service';
import { AuthService } from '../../../core/services/auth.service';
import { Asset, PagedResult, AssetStatus } from '../../../core/models';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { AssetStatusPipe } from '../../../shared/pipes/asset-status.pipe';

@Component({
  selector: 'app-assets-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    LoadingSpinnerComponent,
    AssetStatusPipe
  ],
  template: `
    <div class="assets-container">
      <header class="page-header">
        <div class="header-content">
          <h1>Zarządzanie Aktywami</h1>
          <button
            *ngIf="canManage"
            routerLink="/assets/create"
            class="btn btn-primary"
          >
            + Dodaj Aktywo
          </button>
        </div>
      </header>

      <div class="filters-section">
        <div class="search-box">
          <input
            type="text"
            placeholder="Szukaj aktywów..."
            [formControl]="searchControl"
            class="search-input"
          >
        </div>

        <div class="filter-buttons">
          <button
            *ngFor="let status of statusFilters"
            (click)="filterByStatus(status.value)"
            [class.active]="selectedStatus === status.value"
            class="filter-btn"
          >
            {{ status.label }} ({{ getStatusCount(status.value) }})
          </button>
        </div>
      </div>

      <div class="content-area" *ngIf="!isLoading; else loading">
        <div class="assets-grid" *ngIf="assets.length > 0; else noAssets">
          <div class="asset-card" *ngFor="let asset of assets">
            <div class="asset-header">
              <h3>{{ asset.name }}</h3>
              <span
                class="status-badge"
                [ngClass]="'status-' + asset.status.toString().toLowerCase()"
              >
                {{ asset.status | assetStatus }}
              </span>
            </div>

            <div class="asset-details">
              <p><strong>S/N:</strong> {{ asset.serialNumber }}</p>
              <p><strong>Kategoria:</strong> {{ asset.categoryName }}</p>
              <p><strong>Lokalizacja:</strong> {{ asset.locationName || 'Brak' }}</p>
              <p><strong>Wartość:</strong> {{ asset.purchasePrice | currency:'PLN':'symbol':'1.2-2' }}</p>
            </div>

            <div class="asset-actions">
              <button
                [routerLink]="['/assets', asset.id]"
                class="btn btn-sm btn-outline"
              >
                Szczegóły
              </button>
              <button
                *ngIf="canManage"
                [routerLink]="['/assets/edit', asset.id]"
                class="btn btn-sm btn-outline"
              >
                Edytuj
              </button>
            </div>
          </div>
        </div>

        <div class="pagination" *ngIf="pagedResult.totalPages > 1">
          <button
            (click)="changePage(pagedResult.page - 1)"
            [disabled]="!pagedResult.hasPreviousPage"
            class="btn btn-sm"
          >
            Poprzednia
          </button>

          <span class="page-info">
            Strona {{ pagedResult.page }} z {{ pagedResult.totalPages }}
            ({{ pagedResult.totalCount }} aktywów)
          </span>

          <button
            (click)="changePage(pagedResult.page + 1)"
            [disabled]="!pagedResult.hasNextPage"
            class="btn btn-sm"
          >
            Następna
          </button>
        </div>

        <ng-template #noAssets>
          <div class="empty-state">
            <h3>Brak aktywów</h3>
            <p>Nie znaleziono aktywów spełniających kryteria.</p>
            <button
              *ngIf="canManage"
              routerLink="/assets/create"
              class="btn btn-primary"
            >
              Dodaj pierwszy aktywo
            </button>
          </div>
        </ng-template>
      </div>

      <ng-template #loading>
        <app-loading-spinner message="Ładowanie aktywów..."></app-loading-spinner>
      </ng-template>
    </div>
  `,
  styles: [`
    .assets-container {
      padding: 20px;
      max-width: 1400px;
      margin: 0 auto;
    }

    .page-header {
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 1px solid #eee;
    }

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .filters-section {
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      margin-bottom: 30px;
    }

    .search-input {
      width: 100%;
      max-width: 400px;
      padding: 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
      margin-bottom: 20px;
    }

    .filter-buttons {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }

    .filter-btn {
      padding: 8px 16px;
      border: 1px solid #ddd;
      border-radius: 4px;
      background: white;
      cursor: pointer;
      font-size: 12px;
      transition: all 0.2s;
    }

    .filter-btn.active {
      background-color: #3498db;
      color: white;
      border-color: #3498db;
    }

    .assets-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 20px;
    }

    .asset-card {
      background: white;
      border-radius: 8px;
      padding: 20px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      transition: transform 0.2s;
    }

    .asset-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }

    .asset-header {
      display: flex;
      justify-content: space-between;
      align-items: start;
      margin-bottom: 15px;
    }

    .asset-header h3 {
      margin: 0;
      font-size: 18px;
    }

    .status-badge {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
    }

    .status-available { background-color: #d4edda; color: #155724; }
    .status-assigned { background-color: #fff3cd; color: #856404; }
    .status-inmaintenance { background-color: #f8d7da; color: #721c24; }
    .status-retired { background-color: #e2e3e5; color: #383d41; }
    .status-lost { background-color: #e7e3ff; color: #6f42c1; }

    .asset-details p {
      margin: 8px 0;
      font-size: 14px;
    }

    .asset-actions {
      display: flex;
      gap: 10px;
      margin-top: 15px;
      padding-top: 15px;
      border-top: 1px solid #eee;
    }

    .btn {
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      text-decoration: none;
      display: inline-block;
      text-align: center;
      transition: all 0.2s;
    }

    .btn-primary {
      background-color: #3498db;
      color: white;
    }

    .btn-primary:hover {
      background-color: #2980b9;
    }

    .btn-outline {
      border: 1px solid #ddd;
      background: white;
      color: #333;
    }

    .btn-outline:hover {
      background-color: #f8f9fa;
    }

    .btn-sm {
      padding: 6px 12px;
      font-size: 12px;
    }

    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 20px;
      margin-top: 40px;
      padding: 20px;
    }

    .page-info {
      font-size: 14px;
      color: #666;
    }

    .empty-state {
      text-align: center;
      padding: 60px 20px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .empty-state h3 {
      color: #666;
      margin-bottom: 10px;
    }

    .empty-state p {
      color: #999;
      margin-bottom: 30px;
    }

    @media (max-width: 768px) {
      .header-content {
        flex-direction: column;
        align-items: stretch;
        gap: 15px;
      }

      .assets-grid {
        grid-template-columns: 1fr;
      }

      .pagination {
        flex-direction: column;
        gap: 10px;
      }
    }
  `]
})
export class AssetsListComponent implements OnInit {
  private readonly assetService = inject(AssetService);
  private readonly authService = inject(AuthService);

  assets: Asset[] = [];
  pagedResult: PagedResult<Asset> = {
    items: [],
    totalCount: 0,
    page: 1,
    pageSize: 12,
    totalPages: 0,
    hasPreviousPage: false,
    hasNextPage: false
  };

  isLoading = false;
  selectedStatus: AssetStatus | 'all' = 'all';

  searchControl = new FormControl('');

  statusFilters = [
    { label: 'Wszystkie', value: 'all' as const },
    { label: 'Dostępne', value: AssetStatus.Available },
    { label: 'Przypisane', value: AssetStatus.Assigned },
    { label: 'W serwisie', value: AssetStatus.InMaintenance },
    { label: 'Wycofane', value: AssetStatus.Retired },
    { label: 'Zgubione', value: AssetStatus.Lost }
  ];

  get canManage(): boolean {
    return this.authService.hasAnyRole(['Admin', 'Manager']);
  }

  ngOnInit(): void {
    this.setupSearch();
    this.loadAssets();
  }

  private setupSearch(): void {
    this.searchControl.valueChanges
      .pipe(
        startWith(''),
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(() => {
        this.pagedResult.page = 1;
        this.loadAssets();
      });
  }

  loadAssets(): void {
    this.isLoading = true;

    const request = {
      page: this.pagedResult.page,
      pageSize: this.pagedResult.pageSize,
      searchTerm: this.searchControl.value || undefined
    };

    this.assetService.getPaged(request).subscribe({
      next: (result) => {
        this.pagedResult = result;
        this.assets = this.filterAssetsByStatus(result.items);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading assets:', error);
        this.isLoading = false;
      }
    });
  }

  filterByStatus(status: AssetStatus | 'all'): void {
    this.selectedStatus = status;
    this.assets = this.filterAssetsByStatus(this.pagedResult.items);
  }

  private filterAssetsByStatus(assets: Asset[]): Asset[] {
    if (this.selectedStatus === 'all') {
      return assets;
    }
    return assets.filter(asset => asset.status === this.selectedStatus);
  }

  getStatusCount(status: AssetStatus | 'all'): number {
    if (status === 'all') {
      return this.pagedResult.items.length;
    }
    return this.pagedResult.items.filter(asset => asset.status === status).length;
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.pagedResult.totalPages) {
      this.pagedResult.page = page;
      this.loadAssets();
    }
  }
}
