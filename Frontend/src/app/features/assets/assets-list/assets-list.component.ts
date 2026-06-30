import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

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
  templateUrl: './assets-list.component.html',
  styleUrls: ['../assets-shared.styles.css', './assets-list.component.css']
})
export class AssetsListComponent implements OnInit {
  private readonly assetService = inject(AssetService);
  private readonly authService = inject(AuthService);
  private readonly cdr = inject(ChangeDetectorRef);

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
  errorMessage = '';
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

  get hasActiveFilters(): boolean {
    return this.selectedStatus !== 'all' || Boolean(this.searchControl.value?.trim());
  }

  ngOnInit(): void {
    this.loadAssets();
    this.setupSearch();
  }

  private setupSearch(): void {
    this.searchControl.valueChanges
      .pipe(
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
    this.errorMessage = '';

    const request = {
      page: this.pagedResult.page,
      pageSize: this.pagedResult.pageSize,
      searchTerm: this.searchControl.value || undefined,
      status: this.selectedStatus === 'all' ? undefined : this.selectedStatus
    };

    this.assetService.getPaged(request).subscribe({
      next: (result) => {
        this.pagedResult = result;
        this.assets = result.items;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading assets:', error);
        this.errorMessage = 'Nie udało się pobrać aktywów. Spróbuj ponownie.';
        this.assets = [];
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

  filterByStatus(status: AssetStatus | 'all'): void {
    this.selectedStatus = status;
    this.pagedResult.page = 1;
    this.loadAssets();
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.pagedResult.totalPages) {
      this.pagedResult.page = page;
      this.loadAssets();
    }
  }

  getStatusClass(status: AssetStatus): string {
    return `status-${AssetStatus[status].toLowerCase()}`;
  }
}
