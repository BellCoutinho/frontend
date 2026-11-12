import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export type AlertType = 'success' | 'error' | 'warning' | 'info';

@Component({
  selector: 'app-alert-message',
  standalone: false,
  template: `
    <div *ngIf="visible" class="alert" [class]="'alert alert-' + type" role="alert">
      <span class="alert-icon" [innerHTML]="getIcon()"></span>
      <span class="alert-text">{{ message }}</span>
      <button *ngIf="dismissible" class="alert-dismiss" (click)="dismiss()" aria-label="Fechar">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
        </svg>
      </button>
    </div>
  `,
  styles: [`
    .alert {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      padding: 10px 14px;
      border-radius: var(--pd-radius-sm);
      font-size: 0.875rem;
      border: 1px solid;
      margin-bottom: 16px;
    }

    .alert-success {
      background: rgba(34, 197, 94, 0.1);
      color: #4ade80;
      border-color: rgba(34, 197, 94, 0.3);
    }

    .alert-error {
      background: rgba(239, 68, 68, 0.1);
      color: #f87171;
      border-color: rgba(239, 68, 68, 0.3);
    }

    .alert-warning {
      background: rgba(245, 158, 11, 0.1);
      color: #fbbf24;
      border-color: rgba(245, 158, 11, 0.3);
    }

    .alert-info {
      background: rgba(59, 130, 246, 0.1);
      color: #60a5fa;
      border-color: rgba(59, 130, 246, 0.3);
    }

    .alert-icon {
      flex-shrink: 0;
      display: flex;
      align-items: center;
      margin-top: 1px;
    }

    .alert-text {
      flex: 1;
      line-height: 1.4;
    }

    .alert-dismiss {
      background: none;
      border: none;
      cursor: pointer;
      color: inherit;
      opacity: 0.7;
      display: flex;
      align-items: center;
      padding: 0;
      flex-shrink: 0;
      margin-top: 1px;

      &:hover { opacity: 1; }
    }
  `],
})
export class AlertMessageComponent {
  @Input() type: AlertType = 'info';
  @Input() message = '';
  @Input() dismissible = true;
  @Output() dismissed = new EventEmitter<void>();

  visible = true;

  dismiss(): void {
    this.visible = false;
    this.dismissed.emit();
  }

  show(): void {
    this.visible = true;
  }

  getIcon(): string {
    const icons: Record<AlertType, string> = {
      success: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>',
      error:   '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>',
      warning: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg>',
      info:    '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>',
    };
    return icons[this.type];
  }
}
