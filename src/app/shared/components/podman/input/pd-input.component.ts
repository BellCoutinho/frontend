import {
  Component,
  Input,
  forwardRef,
  Output,
  EventEmitter
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'pd-input',
  standalone: false,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PdInputComponent),
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

      <div class="pd-input-container" [class.focused]="isFocused" [class.disabled]="disabled">
        <!-- Prefix icon / template -->
        <span class="pd-input-prefix" *ngIf="hasPrefix">
          <ng-content select="[prefix]"></ng-content>
        </span>

        <input
          [id]="id"
          [type]="actualType"
          [placeholder]="placeholder"
          [disabled]="disabled"
          [readonly]="readonly"
          [value]="value"
          [autocomplete]="autocomplete"
          (input)="onInputChange($event)"
          (focus)="onFocus()"
          (blur)="onBlur()"
        />

        <!-- Password toggle button -->
        <button
          *ngIf="type === 'password'"
          type="button"
          class="pd-input-toggle-pwd"
          (click)="togglePasswordVisibility()"
          tabindex="-1"
          [title]="showPassword ? 'Ocultar senha' : 'Ver senha'"
        >
          <svg *ngIf="!showPassword" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
          </svg>
          <svg *ngIf="showPassword" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>
          </svg>
        </button>

        <!-- Suffix icon / template -->
        <span class="pd-input-suffix" *ngIf="hasSuffix">
          <ng-content select="[suffix]"></ng-content>
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
        .pd-input-container {
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
      letter-spacing: 0.01em;
    }

    .pd-required-asterisk {
      color: var(--pd-accent, #8b5cf6);
      margin-left: 2px;
    }

    .pd-hint {
      color: var(--pd-text-muted, #71717a);
      font-size: 0.75rem;
    }

    .pd-input-container {
      position: relative;
      display: flex;
      align-items: center;
      background-color: var(--pd-bg-input, #252525);
      border: 1px solid var(--pd-border, #3f3f3f);
      border-radius: var(--pd-radius-sm, 4px);
      transition: all var(--pd-transition, 150ms ease);
      overflow: hidden;

      &.focused {
        border-color: var(--pd-border-focus, #8b5cf6);
        box-shadow: 0 0 0 2px var(--pd-accent-glow, rgba(139, 92, 246, 0.3));
      }

      &.disabled {
        opacity: 0.5;
        background-color: rgba(37, 37, 37, 0.5);
      }

      input {
        flex: 1;
        width: 100%;
        background: transparent;
        border: none;
        outline: none;
        color: var(--pd-text-primary, #d4d4d8);
        font-family: inherit;
        font-size: 0.875rem;
        padding: 8px 12px;
        min-height: 36px;

        &::placeholder {
          color: var(--pd-text-muted, #71717a);
        }

        &:disabled {
          cursor: not-allowed;
        }
      }
    }

    .pd-input-prefix,
    .pd-input-suffix {
      display: inline-flex;
      align-items: center;
      padding: 0 8px;
      color: var(--pd-text-muted, #71717a);
    }

    .pd-input-toggle-pwd {
      background: none;
      border: none;
      padding: 0 10px;
      color: var(--pd-text-muted, #71717a);
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      transition: color var(--pd-transition, 150ms ease);

      &:hover {
        color: var(--pd-text-primary, #d4d4d8);
      }
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
export class PdInputComponent implements ControlValueAccessor {
  @Input() label = '';
  @Input() placeholder = '';
  @Input() type: 'text' | 'password' | 'email' | 'number' | 'date' | 'tel' = 'text';
  @Input() id = `pd-input-${Math.random().toString(36).substring(2, 9)}`;
  @Input() hint = '';
  @Input() error = '';
  @Input() required = false;
  @Input() disabled = false;
  @Input() readonly = false;
  @Input() autocomplete = 'off';
  @Input() hasPrefix = false;
  @Input() hasSuffix = false;
  @Input() value: any = '';

  @Output() inputChange = new EventEmitter<any>();
  isFocused = false;
  showPassword = false;

  get actualType(): string {
    if (this.type === 'password') {
      return this.showPassword ? 'text' : 'password';
    }
    return this.type;
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

  onInputChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value = target.value;
    this.onChange(this.value);
    this.inputChange.emit(this.value);
  }

  onFocus(): void {
    this.isFocused = true;
  }

  onBlur(): void {
    this.isFocused = false;
    this.onTouched();
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
}
