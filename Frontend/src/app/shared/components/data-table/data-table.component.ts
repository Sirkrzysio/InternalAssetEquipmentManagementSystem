
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
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.css']
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
