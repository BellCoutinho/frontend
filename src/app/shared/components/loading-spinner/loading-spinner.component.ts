import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-spinner',
  standalone: false,
  template: `
    <div class="spinner-wrapper" [class.inline]="inline">
      <div class="spinner" [style.width.px]="size" [style.height.px]="size"></div>
      <span *ngIf="label" class="spinner-label">{{ label }}</span>
    </div>
  `,
  styles: [`
    .spinner-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 10px;
      padding: 16px;

      &.inline {
        flex-direction: row;
        padding: 0;
        gap: 8px;
      }
    }

    .spinner {
      border: 2px solid var(--pd-border);
      border-top-color: var(--pd-accent);
      border-radius: 50%;
      animation: spin 0.7s linear infinite;
    }

    .spinner-label {
      color: var(--pd-text-secondary);
      font-size: 0.85rem;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `],
})
export class LoadingSpinnerComponent {
  @Input() size = 24;
  @Input() label = '';
  @Input() inline = false;
}
