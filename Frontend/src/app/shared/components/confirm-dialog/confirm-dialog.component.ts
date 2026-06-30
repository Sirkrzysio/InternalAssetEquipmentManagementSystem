import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css']
})
export class ConfirmDialogComponent implements OnChanges {
  @ViewChild('dialogPanel') private dialogPanel?: ElementRef<HTMLElement>;
  @ViewChild('cancelButton') private cancelButton?: ElementRef<HTMLButtonElement>;

  private previouslyFocusedElement?: HTMLElement;

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

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['isOpen']) {
      return;
    }

    if (this.isOpen) {
      this.previouslyFocusedElement = document.activeElement as HTMLElement;
      queueMicrotask(() => this.cancelButton?.nativeElement.focus());
      return;
    }

    this.previouslyFocusedElement?.focus();
    this.previouslyFocusedElement = undefined;
  }

  @HostListener('document:keydown', ['$event'])
  onDocumentKeydown(event: KeyboardEvent): void {
    if (!this.isOpen) {
      return;
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      this.onCancel();
      return;
    }

    if (event.key === 'Tab') {
      this.keepFocusInsideDialog(event);
    }
  }

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

  private keepFocusInsideDialog(event: KeyboardEvent): void {
    const panel = this.dialogPanel?.nativeElement;
    if (!panel) {
      return;
    }

    const focusableElements = Array.from(
      panel.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
    );

    if (focusableElements.length === 0) {
      event.preventDefault();
      panel.focus();
      return;
    }

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    const activeElement = document.activeElement;

    if (event.shiftKey && activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    } else if (!event.shiftKey && activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  }
}
