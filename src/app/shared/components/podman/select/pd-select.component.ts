import {
  Component,
  Input,
  forwardRef,
  Output,
  EventEmitter
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface PdSelectOption {
  value: any;
  label: string;
}

@Component({
  selector: 'pd-select',
  standalone: false,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PdSelectComponent),
      multi: true
    }
  ],
  template: `
    <div class="pd-form-group" [class.has-error]="!!error">
      <div class="pd-label-row" *ngIf="label">
        <label [attr.for]="id" class="pd-label">
          {{ label }}
          <span *ngIf="required" class="pd-required-asterisk">*</span>
        </label>
        <span *ngIf="hint && !error" class="pd-hint">{{ hint }}</span>
      </div>

      <div class="pd-select-container" [class.focused]="isFocused" [class.disabled]="disabled">
        <select
          [id]="id"
          [disabled]="disabled"
          [value]="value"
          (change)="onSelectChange($event)"
          (focus)="onFocus()"
          (blur)="onBlur()"
        >
          <option *ngIf="placeholder" value="" disabled [selected]="!value">
            {{ placeholder }}
          </option>
          <option
            *ngFor="let opt of normalizedOptions"
            [value]="opt.value"
            [selected]="opt.value === value"
          >
            {{ opt.label }}
          </option>
        </select>

        <span class="pd-select-chevron" aria-hidden="true">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M7 10l5 5 5-5z"/>
          </svg>
        </span>
      </div>

      <div class="pd-error-row" *ngIf="error">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
        </svg>
        <span>{{ error }}</span>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
    }

    .pd-form-group {
      display: flex;
      flex-direction: column;
      margin-bottom: 16px;

      &.has-error {
        .pd-select-container {
          border-color: var(--pd-error, #ef4444);

          &.focused {
            box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.25);
          }
        }

        .pd-label {
          color: var(--pd-error, #ef4444);
        }
      }
    }

    .pd-label-row {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 6px;
    }

    .pd-label {
      color: var(--pd-text-secondary, #a1a1aa);
      font-size: 0.8125rem;
      font-weight: 500;
    }

    .pd-required-asterisk {
      color: var(--pd-accent, #8b5cf6);
      margin-left: 2px;
    }

    .pd-hint {
      color: var(--pd-text-muted, #71717a);
      font-size: 0.75rem;
    }

    .pd-select-container {
      position: relative;
      display: flex;
      align-items: center;
      background-color: var(--pd-bg-input, #252525);
      border: 1px solid var(--pd-border, #3f3f3f);
      border-radius: var(--pd-radius-sm, 4px);
      transition: all var(--pd-transition, 150ms ease);

      &.focused {
        border-color: var(--pd-border-focus, #8b5cf6);
        box-shadow: 0 0 0 2px var(--pd-accent-glow, rgba(139, 92, 246, 0.3));
      }

      &.disabled {
        opacity: 0.5;
        background-color: rgba(37, 37, 37, 0.5);
      }

      select {
        flex: 1;
        width: 100%;
        background: transparent;
        border: none;
        outline: none;
        color: var(--pd-text-primary, #d4d4d8);
        font-family: inherit;
        font-size: 0.875rem;
        padding: 8px 32px 8px 12px;
        min-height: 36px;
        appearance: none;
        cursor: pointer;

        option {
          background-color: var(--pd-bg-card, #2a2a2a);
          color: var(--pd-text-primary, #d4d4d8);
        }

        &:disabled {
          cursor: not-allowed;
        }
      }
    }

    .pd-select-chevron {
      position: absolute;
      right: 10px;
      pointer-events: none;
      color: var(--pd-text-muted, #71717a);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .pd-error-row {
      display: flex;
      align-items: center;
      gap: 4px;
      margin-top: 5px;
      font-size: 0.775rem;
      color: var(--pd-error, #ef4444);
    }
  `]
})
export class PdSelectComponent implements ControlValueAccessor {
  @Input() label = '';
  @Input() placeholder = '';
  @Input() id = `pd-select-${Math.random().toString(36).substring(2, 9)}`;
  @Input() hint = '';
  @Input() error = '';
  @Input() required = false;
  @Input() disabled = false;
  @Input() options: Array<string | PdSelectOption> = [];

  @Output() selectionChange = new EventEmitter<any>();

  value: any = '';
  isFocused = false;

  get normalizedOptions(): PdSelectOption[] {
    if (!this.options) return [];
    return this.options.map((opt) => {
      if (typeof opt === 'string') {
        return { value: opt, label: opt };
      }
      return opt;
    });
  }

  // ControlValueAccessor implementation
  private onChange: (val: any) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: any): void {
    this.value = value ?? '';
  }

  registerOnChange(fn: (val: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onSelectChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.value = target.value;
    this.onChange(this.value);
    this.selectionChange.emit(this.value);
  }

  onFocus(): void {
    this.isFocused = true;
  }

  onBlur(): void {
    this.isFocused = false;
    this.onTouched();
  }
}
