import { Component, Input } from '@angular/core';

@Component({
  selector: 'pd-form-section',
  standalone: false,
  template: `
    <div class="pd-form-section">
      <div class="pd-section-header" *ngIf="title">
        <h3 class="pd-section-title">{{ title }}</h3>
        <p class="pd-section-desc" *ngIf="description">{{ description }}</p>
      </div>

      <div class="pd-section-body">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      margin-bottom: 24px;
    }

    .pd-form-section {
      background-color: var(--pd-bg-card, #2a2a2a);
      border: 1px solid var(--pd-border, #3f3f3f);
      border-radius: var(--pd-radius, 6px);
      padding: 20px;
    }

    .pd-section-header {
      margin-bottom: 16px;
      padding-bottom: 12px;
      border-bottom: 1px solid var(--pd-border-subtle, #2d2d2d);
    }

    .pd-section-title {
      font-size: 1rem;
      font-weight: 600;
      color: var(--pd-text-primary, #d4d4d8);
      margin: 0;
    }

    .pd-section-desc {
      font-size: 0.8125rem;
      color: var(--pd-text-secondary, #a1a1aa);
      margin: 4px 0 0 0;
    }

    .pd-section-body {
      display: flex;
      flex-direction: column;
    }
  `]
})
export class PdFormSectionComponent {
  @Input() title = '';
  @Input() description = '';
}
