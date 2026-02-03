import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css']
})
export class ConfirmDialogComponent {
  @Input() isOpen = false;
  @Input() title = 'Potwierdź akcję';
  @Input() message = 'Czy na pewno chcesz wykonać tę akcję?';
  @Input() details = '';
  @Input() type: 'danger' | 'warning' | 'info' | 'success' = 'warning';
  @Input() confirmText = 'Potwierdź';
  @Input() cancelText = 'Anuluj';
  @Input() processingText = 'Przetwarzanie...';
  @Input() isProcessing = false;

  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onConfirm(): void {
    if (!this.isProcessing) {
      this.confirm.emit();
    }
  }

  onCancel(): void {
    if (!this.isProcessing) {
      this.cancel.emit();
    }
  }

  onOverlayClick(event: Event): void {
    if (event.target === event.currentTarget && !this.isProcessing) {
      this.onCancel();
    }
  }

  getIcon(): string {
    switch (this.type) {
      case 'danger': return '⚠️';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      case 'success': return '✅';
      default: return '⚠️';
    }
  }
}
