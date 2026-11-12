import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'pd-card',
  standalone: false,
  template: `
    <div
      class="pd-card"
      [class.clickable]="clickable"
      [class.hoverable]="hoverable"
      [class.compact]="compact"
      [class.no-border]="noBorder"
      (click)="onClick($event)"
    >
      <!-- Optional Card Header -->
      <div class="pd-card-header" *ngIf="title || hasHeader">
        <div class="pd-card-title-group">
          <span class="pd-card-icon" *ngIf="hasIcon">
            <ng-content select="[card-icon]"></ng-content>
          </span>
          <div class="pd-card-titles">
            <h3 class="pd-card-title" *ngIf="title">{{ title }}</h3>
            <p class="pd-card-subtitle" *ngIf="subtitle">{{ subtitle }}</p>
          </div>
        </div>

        <div class="pd-card-actions">
          <ng-content select="[card-actions]"></ng-content>
        </div>
      </div>

      <!-- Card Body -->
      <div class="pd-card-body">
        <ng-content></ng-content>
      </div>

      <!-- Optional Card Footer -->
      <div class="pd-card-footer" *ngIf="hasFooter">
        <ng-content select="[card-footer]"></ng-content>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .pd-card {
      background-color: var(--pd-bg-card, #2a2a2a);
      border: 1px solid var(--pd-border, #3f3f3f);
      border-radius: var(--pd-radius, 6px);
      transition: all var(--pd-transition, 150ms ease);
      display: flex;
      flex-direction: column;
      overflow: hidden;

      &.no-border {
        border: none;
      }

      &.hoverable:hover {
        border-color: var(--pd-border-focus, #8b5cf6);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
      }

      &.clickable {
        cursor: pointer;

        &:hover {
          border-color: var(--pd-border-focus, #8b5cf6);
          transform: translateY(-1px);
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.35);
        }

        &:active {
          transform: translateY(0);
        }
      }

      &.compact {
        .pd-card-header {
          padding: 10px 14px;
        }

        .pd-card-body {
          padding: 12px 14px;
        }

        .pd-card-footer {
          padding: 8px 14px;
        }
      }
    }

    .pd-card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 14px 18px;
      border-bottom: 1px solid var(--pd-border-subtle, #2d2d2d);
    }

    .pd-card-title-group {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .pd-card-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--pd-accent, #8b5cf6);
    }

    .pd-card-titles {
      display: flex;
      flex-direction: column;
    }

    .pd-card-title {
      font-size: 1rem;
      font-weight: 600;
      color: var(--pd-text-primary, #d4d4d8);
      margin: 0;
    }

    .pd-card-subtitle {
      font-size: 0.8125rem;
      color: var(--pd-text-secondary, #a1a1aa);
      margin: 2px 0 0 0;
    }

    .pd-card-actions {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .pd-card-body {
      padding: 18px;
      flex: 1;
    }

    .pd-card-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      padding: 12px 18px;
      border-top: 1px solid var(--pd-border-subtle, #2d2d2d);
      background-color: rgba(0, 0, 0, 0.1);
    }
  `]
})
export class PdCardComponent {
  @Input() title = '';
  @Input() subtitle = '';
  @Input() clickable = false;
  @Input() hoverable = false;
  @Input() compact = false;
  @Input() noBorder = false;
  @Input() hasIcon = false;
  @Input() hasHeader = false;
  @Input() hasFooter = false;

  @Output() cardClick = new EventEmitter<MouseEvent>();

  onClick(event: MouseEvent): void {
    if (this.clickable) {
      this.cardClick.emit(event);
    }
  }
}
