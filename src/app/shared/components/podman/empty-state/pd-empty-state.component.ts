import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'pd-empty-state',
  standalone: false,
  template: `
    <div class="pd-empty-state">
      <div class="pd-empty-icon">
        <ng-content select="[icon]"></ng-content>
        <svg *ngIf="!hasCustomIcon" width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 6h-2.18c.07-.44.18-.88.18-1.25C18 2.69 16.31 1 14.25 1c-1.21 0-2.21.57-2.95 1.4L10 4.01l-1.3-1.61C8.21 1.57 7.21 1 6 1 3.94 1 2.25 2.69 2.25 4.75c0 .37.1.81.17 1.25H2a2 2 0 00-2 2v2a2 2 0 002 2h.08L3 20c.08.84.84 1.5 1.72 1.5h14.56c.88 0 1.64-.66 1.72-1.5l.92-9.75H22a2 2 0 002-2V8a2 2 0 00-2-2zm-5.75-3.25c.55 0 1 .45 1 1 0 .56-.45 1-1 1-.56 0-1-.44-1-1 0-.55.44-1 1-1zM6 2.75c.55 0 1 .45 1 1 0 .56-.45 1-1 1-.56 0-1-.44-1-1 0-.55.44-1 1-1zM22 10H2V8h20v2z"/>
        </svg>
      </div>

      <h3 class="pd-empty-title">{{ title }}</h3>
      <p class="pd-empty-desc" *ngIf="description">{{ description }}</p>

      <div class="pd-empty-actions">
        <ng-content select="[actions]"></ng-content>

        <pd-button
          *ngIf="actionLabel"
          variant="primary"
          size="sm"
          (clicked)="actionClick.emit()"
        >
          {{ actionLabel }}
        </pd-button>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
    }

    .pd-empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 48px 24px;
      background-color: var(--pd-bg-card, #2a2a2a);
      border: 1px dashed var(--pd-border, #3f3f3f);
      border-radius: var(--pd-radius, 6px);
      margin: 16px 0;
    }

    .pd-empty-icon {
      color: var(--pd-text-muted, #71717a);
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0.7;
    }

    .pd-empty-title {
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--pd-text-primary, #d4d4d8);
      margin: 0 0 6px 0;
    }

    .pd-empty-desc {
      font-size: 0.875rem;
      color: var(--pd-text-secondary, #a1a1aa);
      max-width: 440px;
      margin: 0 0 16px 0;
      line-height: 1.4;
    }

    .pd-empty-actions {
      display: flex;
      align-items: center;
      gap: 10px;
    }
  `]
})
export class PdEmptyStateComponent {
  @Input() title = 'Nenhum item encontrado';
  @Input() description = '';
  @Input() actionLabel = '';
  @Input() hasCustomIcon = false;

  @Output() actionClick = new EventEmitter<void>();
}
