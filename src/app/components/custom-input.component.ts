import { CommonModule } from '@angular/common';
import { Component, computed, ElementRef, forwardRef, HostBinding, HostListener, inject, Input, Optional, Renderer2, Self, signal, ViewChild } from '@angular/core';
import { AbstractControl, ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, NgControl, ValidationErrors, Validator } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@Component({
  standalone: true,
  selector: 'app-custom-input',
  imports: [
    CommonModule,
    MatIconModule,
  ],
  templateUrl: './custom-input.component.html',
  styleUrl: './custom-input.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomInputComponent),
      multi: true
    }
  ]
})
export class CustomInputComponent implements ControlValueAccessor {
  @Input() variant: 'standard' | 'label-left' | 'floating' | 'outline' = 'standard';
  @Input() type: 'text' | 'password' | 'number' | 'list' | 'date' | 'time' = 'text';
  @Input() label?: string = '';
  @Input() width?: string = '100%';
  @Input() inputWidth?: string = '100%';
  @Input() focusEffect: 'outline' | 'underline' = 'outline';
  @Input() placeholder: string = '';
  @Input() options?: string[] = [];

  @Input()
  set readonly(val: any) {
    this._readonly = val !== false && val !== 'false';
  }

  get readonly(): boolean {
    return this._readonly;
  }

  private _readonly = false;

  @Input()
  set required(val: boolean) {
    this._required = val;
  }

  get required(): boolean {
    return this._required;
  }

  private _required = false;

  value: string = '';
  isDisabled: boolean = false;
  isFocused: boolean = false;

  constructor(
    private renderer: Renderer2,
    private elementRef: ElementRef
  ) {
    this.unlistenClick = this.renderer.listen('document', 'click', (event: Event) => 
      this.handleOutsideClick(event)
    );
  }

  private onChange = (value: any) => {};
  private onTouched = () => {};

  writeValue(obj: any): void {
    this.value = obj ?? null;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(_isDisabled: boolean): void {
    this.isDisabled = _isDisabled;
  }

  onInputChange(event: Event): void {
    // const inputElement = event.target as HTMLInputElement;
    // this.value = inputElement.value;
    // this.onChange(this.value);

    let newValue = (event.target as HTMLInputElement).value;

    // anything

    this.value = newValue;
    this.onChange(this.value);
  }

  onBlur(): void {
    this.isFocused = false;
    this.onTouched();
    console.log(this.value);
  }

  onFocus(): void {
    this.isFocused = true;
  }

  @HostBinding('style.width')
  get hostWidth(): string {
    return this.width || '100%';
  }

  getInputWidth(): string {
    if (this.variant !== 'label-left' || !this.inputWidth) {
      return '100%';
    }
  
    return `min(${this.inputWidth}, 100%)`;
  }

  @ViewChild('input') inputRef!: ElementRef<HTMLInputElement>;

  handleWrapperClick(): void {
    if (this.variant === 'floating' || this.variant === 'outline') {
      this.inputRef?.nativeElement.focus();
      this.tryToggleDropdown();
    }
  }

  handleInputClick(): void {
    if (this.variant === 'standard' || this.variant === 'label-left') {
      this.inputRef?.nativeElement.focus();
      this.tryToggleDropdown();
    }
  }

  private tryToggleDropdown(): void {
    if (this.type === 'list') {
      this.showDropdownSignal.update(value => !value);
    }
  }

  get showPlaceholder(): boolean {
    if (this.variant === 'standard' || this.variant === 'label-left') {
      return true;
    }

    return this.isFocused;
  }

  private showPasswordSignal = signal(false);
  protected showPassword = computed(() => this.showPasswordSignal());

  togglePassword(): void {
    this.showPasswordSignal.update(value => !value);
  }

  get inputType(): string {
    if (this.type === 'password') {
      return this.showPasswordSignal() ? 'text' : 'password';
    }
    return this.type;
  }

  private showDropdownSignal = signal(false);
  protected showDropdown = computed(() => this.showDropdownSignal());

  toggleDropdown(): void {
    this.showDropdownSignal.update(value => !value);
  }

  selectOption(option: any, event: Event): void {
    event.stopPropagation();
    this.value = option;
    this.onChange(this.value);
    this.showDropdownSignal.set(false);
  }

  clearOption(event: Event): void {
    event.stopPropagation();
    this.value = '';
    this.onChange(this.value);
    this.showDropdownSignal.set(false);
  }

  private unlistenClick!: () => void;

  ngOnDestroy() {
    this.unlistenClick?.();
  }

  handleOutsideClick(event: Event): void {
    const target = event.target as HTMLElement;
    const clickedInside = this.elementRef.nativeElement.contains(target);
    if (!clickedInside && this.showDropdown()) {
      this.showDropdownSignal.set(false);
    }
  }

  @HostListener('document:keydown.escape')
  onEscape() {
    if (this.showDropdown()) {
      this.showDropdownSignal.set(false);
    }
  }
}