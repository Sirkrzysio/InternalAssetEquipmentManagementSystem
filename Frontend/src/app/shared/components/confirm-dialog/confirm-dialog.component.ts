
// CONFIRM DIALOG COMPONENT - Confirmation Modal


import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal-overlay" *ngIf="isOpen" (click)="onOverlayClick($event)">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h3>{{ title }}</h3>
          <button class="close-btn" (click)="onCancel()" aria-label="Zamknij">×</button>
        </div>

        <div class="modal-body">
          <div class="icon-container" [ngClass]="'icon-' + type">
            <span class="icon">{{ getIcon() }}</span>
          </div>
          <p>{{ message }}</p>
          <div *ngIf="details" class="details">
            {{ details }}
          </div>
        </div>

        <div class="modal-footer">
          <button
            class="btn btn-secondary"
            (click)="onCancel()"
            [disabled]="isProcessing"
          >
            {{ cancelText }}
          </button>
          <button
            class="btn"
            [ngClass]="'btn-' + type"
            (click)="onConfirm()"
            [disabled]="isProcessing"
          >
            <span *ngIf="isProcessing" class="spinner"></span>
            {{ isProcessing ? processingText : confirmText }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      animation: fadeIn 0.2s ease-out;
    }

    .modal-content {
      background: white;
      border-radius: 8px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
      max-width: 500px;
      width: 90%;
      max-height: 80vh;
      overflow-y: auto;
      animation: slideIn 0.3s ease-out;
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 24px;
      border-bottom: 1px solid #eee;
    }

    .modal-header h3 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      color: #333;
    }

    .close-btn {
      background: none;
      border: none;
      font-size: 24px;
      color: #666;
      cursor: pointer;
      padding: 0;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .close-btn:hover {
      background-color: #f0f0f0;
      color: #333;
    }

    .modal-body {
      padding: 24px;
      text-align: center;
    }

    .icon-container {
      width: 64px;
      height: 64px;
      margin: 0 auto 20px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .icon-container.icon-danger {
      background-color: #fee;
      border: 2px solid #fcc;
    }

    .icon-container.icon-warning {
      background-color: #fffbf0;
      border: 2px solid #ffeaa7;
    }

    .icon-container.icon-info {
      background-color: #f0f8ff;
      border: 2px solid #b3d9ff;
    }

    .icon-container.icon-success {
      background-color: #f0fff4;
      border: 2px solid #b3ffcc;
    }

    .icon {
      font-size: 24px;
    }

    .icon-danger .icon { color: #e74c3c; }
    .icon-warning .icon { color: #f39c12; }
    .icon-info .icon { color: #3498db; }
    .icon-success .icon { color: #27ae60; }

    .modal-body p {
      font-size: 16px;
      color: #333;
      margin-bottom: 16px;
      line-height: 1.5;
    }

    .details {
      font-size: 14px;
      color: #666;
      background-color: #f8f9fa;
      padding: 12px;
      border-radius: 4px;
      text-align: left;
    }

    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      padding: 20px 24px;
      border-top: 1px solid #eee;
      background-color: #f8f9fa;
    }

    .btn {
      padding: 10px 20px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .btn:disabled {
      cursor: not-allowed;
      opacity: 0.6;
    }

    .btn-secondary {
      background-color: #6c757d;
      color: white;
    }

    .btn-secondary:hover:not(:disabled) {
      background-color: #5a6268;
    }

    .btn-danger {
      background-color: #e74c3c;
      color: white;
    }

    .btn-danger:hover:not(:disabled) {
      background-color: #c0392b;
    }

    .btn-warning {
      background-color: #f39c12;
      color: white;
    }

    .btn-warning:hover:not(:disabled) {
      background-color: #e67e22;
    }

    .btn-info {
      background-color: #3498db;
      color: white;
    }

    .btn-info:hover:not(:disabled) {
      background-color: #2980b9;
    }

    .btn-success {
      background-color: #27ae60;
      color: white;
    }

    .btn-success:hover:not(:disabled) {
      background-color: #229954;
    }

    .spinner {
      width: 16px;
      height: 16px;
      border: 2px solid #ffffff4d;
      border-top: 2px solid #ffffff;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateY(-20px) scale(0.95);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `]
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
