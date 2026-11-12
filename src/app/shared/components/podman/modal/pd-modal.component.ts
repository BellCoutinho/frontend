import {
  Component,
  Input,
  Output,
  EventEmitter,
  HostListener
} from '@angular/core';

@Component({
  selector: 'pd-modal',
  standalone: false,
  template: `
    <div
      *ngIf="isOpen"
      class="pd-modal-backdrop"
      (click)="onBackdropClick($event)"
      role="dialog"
      aria-modal="true"
    >
      <div
        class="pd-modal-window"
        [class]="'pd-modal-' + size"
        (click)="$event.stopPropagation()"
      >
        <!-- Modal Header -->
        <div class="pd-modal-header">
          <div class="pd-modal-titles">
            <h3 class="pd-modal-title" *ngIf="title">{{ title }}</h3>
            <p class="pd-modal-subtitle" *ngIf="subtitle">{{ subtitle }}</p>
          </div>

          <button
            type="button"
            class="pd-modal-close"
            (click)="onClose()"
            title="Fechar"
            aria-label="Fechar"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>

        <!-- Modal Body -->
        <div class="pd-modal-body">
          <ng-content></ng-content>
        </div>

        <!-- Modal Footer Actions -->
        <div class="pd-modal-footer">
          <ng-content select="[modal-actions]"></ng-content>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .pd-modal-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background-color: rgba(0, 0, 0, 0.7);
      backdrop-filter: blur(2px);
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
      animation: pd-fade-in 120ms ease;
    }

    .pd-modal-window {
      background-color: var(--pd-bg-card, #2a2a2a);
      border: 1px solid var(--pd-border, #3f3f3f);
      border-radius: var(--pd-radius, 6px);
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.5);
      display: flex;
      flex-direction: column;
      width: 100%;
      max-height: 90vh;
      overflow: hidden;
      animation: pd-scale-in 150ms ease;
    }

    .pd-modal-sm {
      max-width: 420px;
    }

    .pd-modal-md {
      max-width: 560px;
    }

    .pd-modal-lg {
      max-width: 760px;
    }

    .pd-modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 14px 20px;
      border-bottom: 1px solid var(--pd-border-subtle, #2d2d2d);
    }

    .pd-modal-titles {
      display: flex;
      flex-direction: column;
    }

    .pd-modal-title {
      font-size: 1.1rem;
      font-weight: 600;
      color: var(--pd-text-primary, #d4d4d8);
      margin: 0;
    }

    .pd-modal-subtitle {
      font-size: 0.8125rem;
      color: var(--pd-text-secondary, #a1a1aa);
      margin: 2px 0 0 0;
    }

    .pd-modal-close {
      background: none;
      border: none;
      color: var(--pd-text-muted, #71717a);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 4px;
      border-radius: var(--pd-radius-sm, 4px);
      transition: all var(--pd-transition, 150ms ease);

      &:hover {
        background-color: var(--pd-bg-hover, #3f3f3f);
        color: var(--pd-text-primary, #d4d4d8);
      }
    }

    .pd-modal-body {
      padding: 20px;
      overflow-y: auto;
      color: var(--pd-text-secondary, #a1a1aa);
      font-size: 0.875rem;
      line-height: 1.5;
    }

    .pd-modal-footer {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 10px;
      padding: 14px 20px;
      border-top: 1px solid var(--pd-border-subtle, #2d2d2d);
      background-color: rgba(0, 0, 0, 0.15);
    }

    @keyframes pd-fade-in {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes pd-scale-in {
      from {
        opacity: 0;
        transform: scale(0.96);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }
  `]
})
export class PdModalComponent {
  @Input() isOpen = false;
  @Input() title = '';
  @Input() subtitle = '';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() closeOnBackdrop = true;

  @Output() close = new EventEmitter<void>();

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    if (this.isOpen) {
      this.onClose();
    }
  }

  onBackdropClick(event: MouseEvent): void {
    if (this.closeOnBackdrop) {
      this.onClose();
    }
  }

  onClose(): void {
    this.close.emit();
  }
}
