import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'pd-page-header',
  standalone: false,
  template: `
    <header class="pd-page-header">
      <div class="pd-header-left">
        <!-- Optional Back Button -->
        <button
          *ngIf="showBack"
          type="button"
          class="pd-back-btn"
          (click)="back.emit()"
          title="Voltar"
          aria-label="Voltar"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
          </svg>
        </button>

        <!-- Icon slot or default -->
        <span class="pd-header-icon" *ngIf="hasIcon">
          <ng-content select="[header-icon]"></ng-content>
        </span>

        <div class="pd-header-titles">
          <div class="pd-title-row">
            <h1 class="pd-page-title">{{ title }}</h1>
            <span *ngIf="count !== null && count !== undefined" class="pd-count-badge">
              {{ count }} {{ countLabel }}
            </span>
            <ng-content select="[title-extra]"></ng-content>
          </div>
          <p *ngIf="subtitle" class="pd-page-subtitle">{{ subtitle }}</p>
        </div>
      </div>

      <!-- Action buttons area -->
      <div class="pd-header-actions">
        <ng-content select="[actions]"></ng-content>
      </div>
    </header>
  `,
  styles: [`
    :host {
      display: block;
      margin-bottom: 20px;
    }

    .pd-page-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      padding-bottom: 16px;
      border-bottom: 1px solid var(--pd-border-subtle, #2d2d2d);
      flex-wrap: wrap;
    }

    .pd-header-left {
      display: flex;
      align-items: center;
      gap: 12px;
      flex: 1;
      min-width: 200px;
    }

    .pd-back-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border-radius: var(--pd-radius-sm, 4px);
      background-color: var(--pd-bg-card, #2a2a2a);
      border: 1px solid var(--pd-border, #3f3f3f);
      color: var(--pd-text-secondary, #a1a1aa);
      cursor: pointer;
      transition: all var(--pd-transition, 150ms ease);
      flex-shrink: 0;

      &:hover {
        background-color: var(--pd-bg-hover, #3f3f3f);
        color: var(--pd-text-primary, #d4d4d8);
      }
    }

    .pd-header-icon {
      display: flex;
      align-items: center;
      color: var(--pd-accent, #8b5cf6);
      flex-shrink: 0;
    }

    .pd-header-titles {
      display: flex;
      flex-direction: column;
    }

    .pd-title-row {
      display: flex;
      align-items: center;
      gap: 10px;
      flex-wrap: wrap;
    }

    .pd-page-title {
      font-size: 1.35rem;
      font-weight: 600;
      color: var(--pd-text-primary, #d4d4d8);
      margin: 0;
      line-height: 1.2;
    }

    .pd-count-badge {
      display: inline-flex;
      align-items: center;
      padding: 2px 8px;
      background-color: var(--pd-bg-card, #2a2a2a);
      border: 1px solid var(--pd-border, #3f3f3f);
      border-radius: 9999px;
      font-size: 0.75rem;
      color: var(--pd-text-muted, #71717a);
      font-weight: 500;
    }

    .pd-page-subtitle {
      font-size: 0.8125rem;
      color: var(--pd-text-secondary, #a1a1aa);
      margin: 4px 0 0 0;
    }

    .pd-header-actions {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }
  `]
})
export class PdPageHeaderComponent {
  @Input() title = '';
  @Input() subtitle = '';
  @Input() count?: number | null = null;
  @Input() countSingular = 'item';
  @Input() countPlural = 'itens';
  @Input() showBack = false;
  @Input() hasIcon = false;

  @Output() back = new EventEmitter<void>();

  get countLabel(): string {
    return this.count === 1 ? this.countSingular : this.countPlural;
  }
}
