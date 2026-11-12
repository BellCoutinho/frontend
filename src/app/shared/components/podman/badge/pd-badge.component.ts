import { Component, Input } from '@angular/core';

export type PdBadgeStatus =
  | 'active'
  | 'success'
  | 'warning'
  | 'danger'
  | 'error'
  | 'expired'
  | 'info'
  | 'purple'
  | 'neutral'
  | 'inactive';

@Component({
  selector: 'pd-badge',
  standalone: false,
  template: `
    <span class="pd-badge" [class]="badgeClasses">
      <span *ngIf="showDot" class="pd-badge-dot" aria-hidden="true"></span>
      <span class="pd-badge-text">
        <ng-content></ng-content>
        <span *ngIf="label">{{ label }}</span>
      </span>
    </span>
  `,
  styles: [`
    :host {
      display: inline-flex;
    }

    .pd-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 2px 8px;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 500;
      line-height: 1.4;
      white-space: nowrap;
      border: 1px solid transparent;

      &.pd-badge-sm {
        padding: 1px 6px;
        font-size: 0.7rem;
      }

      &.pd-badge-md {
        padding: 3px 10px;
        font-size: 0.8125rem;
      }
    }

    .pd-badge-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background-color: currentColor;
      flex-shrink: 0;
    }

    /* Statuses */
    .pd-badge-active,
    .pd-badge-success {
      background-color: rgba(34, 197, 94, 0.12);
      color: #4ade80;
      border-color: rgba(34, 197, 94, 0.25);
    }

    .pd-badge-warning {
      background-color: rgba(245, 158, 11, 0.12);
      color: #fbbf24;
      border-color: rgba(245, 158, 11, 0.25);
    }

    .pd-badge-danger,
    .pd-badge-error,
    .pd-badge-expired {
      background-color: rgba(239, 68, 68, 0.12);
      color: #f87171;
      border-color: rgba(239, 68, 68, 0.25);
    }

    .pd-badge-info {
      background-color: rgba(59, 130, 246, 0.12);
      color: #60a5fa;
      border-color: rgba(59, 130, 246, 0.25);
    }

    .pd-badge-purple {
      background-color: rgba(139, 92, 246, 0.15);
      color: var(--pd-accent-light, #a78bfa);
      border-color: rgba(139, 92, 246, 0.3);
    }

    .pd-badge-neutral,
    .pd-badge-inactive {
      background-color: rgba(113, 113, 122, 0.15);
      color: var(--pd-text-muted, #71717a);
      border-color: rgba(113, 113, 122, 0.25);
    }
  `]
})
export class PdBadgeComponent {
  @Input() status: PdBadgeStatus = 'neutral';
  @Input() label = '';
  @Input() showDot = true;
  @Input() size: 'sm' | 'md' = 'sm';

  get badgeClasses(): string {
    return `pd-badge-${this.status} pd-badge-${this.size}`;
  }
}
