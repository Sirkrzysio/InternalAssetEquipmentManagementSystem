
// DATA TABLE COMPONENT - Reusable Data Grid


import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  type?: 'text' | 'date' | 'number' | 'badge' | 'actions';
  width?: string;
}

export interface TableAction {
  label: string;
  icon?: string;
  class?: string;
  action: (item: any) => void;
}

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="data-table-container">
      <div class="table-header" *ngIf="showSearch">
        <div class="search-box">
          <input
            type="text"
            placeholder="Szukaj..."
            [(ngModel)]="searchTerm"
            (input)="onSearch()"
            class="search-input"
          >
        </div>
      </div>

      <div class="table-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              <th
                *ngFor="let column of columns"
                [style.width]="column.width || 'auto'"
                [class.sortable]="column.sortable"
                (click)="column.sortable ? onSort(column.key) : null"
              >
                {{ column.label }}
                <span *ngIf="column.sortable && sortField === column.key" class="sort-indicator">
                  {{ sortDirection === 'asc' ? '↑' : '↓' }}
                </span>
              </th>
              <th *ngIf="actions && actions.length > 0" class="actions-column">Akcje</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let item of filteredData; trackBy: trackByFn" [class.clickable]="rowClickable" (click)="onRowClick(item)">
              <td *ngFor="let column of columns">
                <ng-container [ngSwitch]="column.type || 'text'">
                  <span *ngSwitchCase="'text'">{{ getNestedValue(item, column.key) }}</span>
                  <span *ngSwitchCase="'date'">{{ getNestedValue(item, column.key) | date:'short' }}</span>
                  <span *ngSwitchCase="'number'">{{ getNestedValue(item, column.key) | number }}</span>
                  <span *ngSwitchCase="'badge'"
                        class="badge"
                        [ngClass]="'badge-' + getNestedValue(item, column.key).toLowerCase()">
                    {{ getNestedValue(item, column.key) }}
                  </span>
                </ng-container>
              </td>
              <td *ngIf="actions && actions.length > 0" class="actions-cell">
                <button
                  *ngFor="let action of actions"
                  (click)="executeAction(action, item, $event)"
                  [class]="'btn btn-sm ' + (action.class || 'btn-outline')"
                  [title]="action.label"
                >
                  <span *ngIf="action.icon">{{ action.icon }}</span>
                  {{ action.label }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <div *ngIf="filteredData.length === 0" class="empty-state">
          <p>Brak danych do wyświetlenia</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .data-table-container {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      overflow: hidden;
    }

    .table-header {
      padding: 20px;
      border-bottom: 1px solid #eee;
    }

    .search-input {
      width: 100%;
      max-width: 300px;
      padding: 8px 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
    }

    .table-wrapper {
      overflow-x: auto;
    }

    .data-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 14px;
    }

    .data-table th {
      background-color: #f8f9fa;
      padding: 12px;
      text-align: left;
      font-weight: 600;
      border-bottom: 2px solid #dee2e6;
      white-space: nowrap;
    }

    .data-table th.sortable {
      cursor: pointer;
      user-select: none;
    }

    .data-table th.sortable:hover {
      background-color: #e9ecef;
    }

    .sort-indicator {
      margin-left: 5px;
      font-size: 12px;
    }

    .data-table td {
      padding: 12px;
      border-bottom: 1px solid #dee2e6;
      vertical-align: middle;
    }

    .data-table tr.clickable {
      cursor: pointer;
    }

    .data-table tr.clickable:hover {
      background-color: #f8f9fa;
    }

    .actions-column {
      width: 150px;
    }

    .actions-cell {
      white-space: nowrap;
    }

    .actions-cell .btn {
      margin-right: 5px;
    }

    .badge {
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
      text-transform: uppercase;
    }

    .badge-available { background: #d4edda; color: #155724; }
    .badge-assigned { background: #fff3cd; color: #856404; }
    .badge-inmaintenance { background: #f8d7da; color: #721c24; }
    .badge-retired { background: #e2e3e5; color: #383d41; }
    .badge-active { background: #d1ecf1; color: #0c5460; }
    .badge-inactive { background: #f8d7da; color: #721c24; }

    .btn {
      padding: 4px 8px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 12px;
      text-decoration: none;
      display: inline-block;
    }

    .btn-outline {
      border: 1px solid #ddd;
      background: white;
      color: #333;
    }

    .btn-outline:hover {
      background-color: #f8f9fa;
    }

    .empty-state {
      padding: 40px;
      text-align: center;
      color: #666;
    }
  `]
})
export class DataTableComponent {
  @Input() data: any[] = [];
  @Input() columns: TableColumn[] = [];
  @Input() actions: TableAction[] = [];
  @Input() showSearch = true;
  @Input() rowClickable = false;

  @Output() rowClick = new EventEmitter<any>();
  @Output() search = new EventEmitter<string>();

  searchTerm = '';
  sortField = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  filteredData: any[] = [];

  ngOnInit(): void {
    this.filteredData = [...this.data];
  }

  ngOnChanges(): void {
    this.applyFilter();
  }

  onSearch(): void {
    this.search.emit(this.searchTerm);
    this.applyFilter();
  }

  onSort(field: string): void {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
    this.applySorting();
  }

  onRowClick(item: any): void {
    if (this.rowClickable) {
      this.rowClick.emit(item);
    }
  }

  executeAction(action: TableAction, item: any, event: Event): void {
    event.stopPropagation();
    action.action(item);
  }

  trackByFn(index: number, item: any): any {
    return item.id || index;
  }

  getNestedValue(obj: any, key: string): any {
    return key.split('.').reduce((o, i) => o?.[i], obj);
  }

  private applyFilter(): void {
    this.filteredData = this.data.filter(item => {
      if (!this.searchTerm) return true;

      return this.columns.some(column => {
        const value = this.getNestedValue(item, column.key);
        return value?.toString().toLowerCase().includes(this.searchTerm.toLowerCase());
      });
    });

    this.applySorting();
  }

  private applySorting(): void {
    if (!this.sortField) return;

    this.filteredData.sort((a, b) => {
      const aVal = this.getNestedValue(a, this.sortField);
      const bVal = this.getNestedValue(b, this.sortField);

      if (aVal < bVal) return this.sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }
}
