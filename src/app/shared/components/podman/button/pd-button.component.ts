import { Component, Input, Output, EventEmitter } from '@angular/core';

export type PdButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'icon';
export type PdButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'pd-button',
  standalone: false,
  template: `
    <button
      [type]="type"
      [disabled]="disabled || loading"
      [class]="buttonClasses"
      [title]="title"
      (click)="onClick($event)"
    >
      <!-- Loading spinner -->
      <span *ngIf="loading" class="pd-btn-spinner" aria-hidden="true"></span>

      <!-- Prefix icon / content -->
      <span class="pd-btn-content" [class.invisible]="loading">
        <ng-content></ng-content>
      </span>
    </button>
  `,
  styles: [`
    :host {
      display: inline-block;

      &.full-width {
        display: block;
        width: 100%;

        button {
          width: 100%;
        }
      }
    }

    button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      font-family: inherit;
      font-weight: 500;
      border-radius: var(--pd-radius-sm, 4px);
      cursor: pointer;
      transition: all var(--pd-transition, 150ms ease);
      white-space: nowrap;
      text-decoration: none;
      position: relative;
      border: 1px solid transparent;

      &:focus-visible {
        outline: none;
        box-shadow: 0 0 0 2px var(--pd-accent-glow, rgba(139, 92, 246, 0.4));
      }

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        pointer-events: none;
      }
    }

    /* Sizes */
    .pd-btn-sm {
      padding: 4px 10px;
      font-size: 0.8rem;
      height: 28px;
    }

    .pd-btn-md {
      padding: 7px 14px;
      font-size: 0.875rem;
      height: 36px;
    }

    .pd-btn-lg {
      padding: 10px 20px;
      font-size: 1rem;
      height: 44px;
    }

    /* Variants */
    .pd-btn-primary {
      background-color: var(--pd-accent, #8b5cf6);
      color: #ffffff;
      border-color: var(--pd-accent, #8b5cf6);

      &:hover:not(:disabled) {
        background-color: var(--pd-accent-hover, #7c3aed);
        border-color: var(--pd-accent-hover, #7c3aed);
      }

      &:active:not(:disabled) {
        filter: brightness(0.9);
      }
    }

    .pd-btn-secondary {
      background-color: transparent;
      color: var(--pd-text-primary, #d4d4d8);
      border-color: var(--pd-border, #3f3f3f);

      &:hover:not(:disabled) {
        background-color: var(--pd-bg-hover, #2a2a2a);
        border-color: var(--pd-text-muted, #71717a);
        color: #ffffff;
      }

      &:active:not(:disabled) {
        background-color: var(--pd-bg-active, #3f3f3f);
      }
    }

    .pd-btn-danger {
      background-color: rgba(239, 68, 68, 0.15);
      color: var(--pd-error, #ef4444);
      border-color: rgba(239, 68, 68, 0.4);

      &:hover:not(:disabled) {
        background-color: var(--pd-error, #ef4444);
        border-color: var(--pd-error, #ef4444);
        color: #ffffff;
      }

      &:active:not(:disabled) {
        filter: brightness(0.9);
      }
    }

    .pd-btn-ghost {
      background-color: transparent;
      color: var(--pd-text-secondary, #a1a1aa);
      border-color: transparent;

      &:hover:not(:disabled) {
        background-color: var(--pd-bg-hover, #2a2a2a);
        color: var(--pd-text-primary, #d4d4d8);
      }
    }

    .pd-btn-icon {
      background-color: transparent;
      color: var(--pd-text-secondary, #a1a1aa);
      border-color: var(--pd-border, #3f3f3f);
      padding: 0;
      width: 32px;
      height: 32px;

      &.pd-btn-sm {
        width: 28px;
        height: 28px;
      }

      &.pd-btn-lg {
        width: 40px;
        height: 40px;
      }

      &:hover:not(:disabled) {
        background-color: var(--pd-bg-hover, #2a2a2a);
        color: var(--pd-text-primary, #d4d4d8);
        border-color: var(--pd-text-muted, #71717a);
      }
    }

    .pd-btn-full {
      width: 100%;
    }

    .pd-btn-content {
      display: inline-flex;
      align-items: center;
      gap: 6px;

      &.invisible {
        visibility: hidden;
      }
    }

    .pd-btn-spinner {
      position: absolute;
      width: 14px;
      height: 14px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top-color: currentColor;
      border-radius: 50%;
      animation: pd-spin 0.6s linear infinite;
    }

    @keyframes pd-spin {
      to { transform: rotate(360deg); }
    }
  `]
})
export class PdButtonComponent {
  @Input() variant: PdButtonVariant = 'primary';
  @Input() size: PdButtonSize = 'md';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() disabled = false;
  @Input() loading = false;
  @Input() title = '';
  @Input() fullWidth = false;

  @Output() clicked = new EventEmitter<MouseEvent>();

  get buttonClasses(): string {
    const classes = [
      `pd-btn-${this.variant}`,
      `pd-btn-${this.size}`
    ];
    if (this.fullWidth) {
      classes.push('pd-btn-full');
    }
    return classes.join(' ');
  }

  onClick(event: MouseEvent): void {
    if (!this.disabled && !this.loading) {
      this.clicked.emit(event);
    }
  }
}
