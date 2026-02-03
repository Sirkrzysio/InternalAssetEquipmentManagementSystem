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
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.css']
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
