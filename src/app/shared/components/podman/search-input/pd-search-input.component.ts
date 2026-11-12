import {
  Component,
  Input,
  Output,
  EventEmitter,
  forwardRef,
  OnDestroy,
  OnInit
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'pd-search-input',
  standalone: false,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PdSearchInputComponent),
      multi: true
    }
  ],
  template: `
    <div class="pd-search-box" [class.focused]="isFocused" [class.has-value]="!!value">
      <span class="pd-search-icon" aria-hidden="true">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
          <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
        </svg>
      </span>

      <input
        type="text"
        [placeholder]="placeholder"
        [value]="value"
        (input)="onInput($event)"
        (focus)="onFocus()"
        (blur)="onBlur()"
      />

      <button
        *ngIf="value"
        type="button"
        class="pd-search-clear"
        (click)="clear()"
        title="Limpar busca"
        aria-label="Limpar busca"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
        </svg>
      </button>
    </div>
  `,
  styles: [`
    :host {
      display: inline-block;
      min-width: 240px;
    }

    .pd-search-box {
      position: relative;
      display: flex;
      align-items: center;
      background-color: var(--pd-bg-input, #252525);
      border: 1px solid var(--pd-border, #3f3f3f);
      border-radius: var(--pd-radius-sm, 4px);
      transition: all var(--pd-transition, 150ms ease);
      height: 34px;
      padding: 0 8px;

      &.focused {
        border-color: var(--pd-border-focus, #8b5cf6);
        box-shadow: 0 0 0 2px var(--pd-accent-glow, rgba(139, 92, 246, 0.3));
      }

      input {
        flex: 1;
        width: 100%;
        background: transparent;
        border: none;
        outline: none;
        color: var(--pd-text-primary, #d4d4d8);
        font-family: inherit;
        font-size: 0.8125rem;
        padding: 4px 6px;

        &::placeholder {
          color: var(--pd-text-muted, #71717a);
        }
      }
    }

    .pd-search-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--pd-text-muted, #71717a);
      margin-right: 4px;
    }

    .pd-search-clear {
      background: transparent;
      border: none;
      color: var(--pd-text-muted, #71717a);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2px;
      border-radius: 50%;
      transition: color var(--pd-transition, 150ms ease);

      &:hover {
        color: var(--pd-text-primary, #d4d4d8);
      }
    }
  `]
})
export class PdSearchInputComponent implements OnInit, OnDestroy, ControlValueAccessor {
  @Input() placeholder = 'Buscar...';
  @Input() debounce = 350;

  @Output() search = new EventEmitter<string>();
  @Output() cleared = new EventEmitter<void>();

  value = '';
  isFocused = false;

  private searchSubject = new Subject<string>();
  private sub?: Subscription;

  // ControlValueAccessor
  private onChange: (val: string) => void = () => {};
  private onTouched: () => void = () => {};

  ngOnInit(): void {
    this.sub = this.searchSubject
      .pipe(debounceTime(this.debounce), distinctUntilChanged())
      .subscribe((query) => {
        this.search.emit(query);
      });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  writeValue(val: any): void {
    this.value = val ?? '';
  }

  registerOnChange(fn: (val: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value = target.value;
    this.onChange(this.value);
    this.searchSubject.next(this.value);
  }

  clear(): void {
    this.value = '';
    this.onChange('');
    this.searchSubject.next('');
    this.cleared.emit();
  }

  onFocus(): void {
    this.isFocused = true;
  }

  onBlur(): void {
    this.isFocused = false;
    this.onTouched();
  }
}
