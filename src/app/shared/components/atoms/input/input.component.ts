import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';

import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { NgIf } from '@angular/common';
import { InputSize, InputType } from '../../../../types/ui/input.types';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [NgIf],
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    }
  ]
})
export class InputComponent implements ControlValueAccessor {
  @Input() type: InputType = 'text';
  @Input() size: InputSize = 'md';
  @Input() placeholder: string = '';
  @Input() disabled: boolean = false;
  @Input() readonly: boolean = false;
  @Input() error: boolean = false;
  @Input() errorMessage: string = '';
  @Input() value: string = '';  // ← Ajoutez cette ligne
  
  @Output() valueChange = new EventEmitter<string>();
  
  // ControlValueAccessor methods
  onChange: any = () => {};
  onTouched: any = () => {};

  get inputClasses(): string {
    const baseClasses = 'w-full rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1';
    
    const sizeClasses: Record<InputSize, string> = {
      sm: 'px-3 py-1.5 text-sm h-9',
      md: 'px-4 py-2.5 text-base h-11',
      lg: 'px-5 py-3 text-lg h-14'
    };

    const stateClasses = this.error 
      ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
      : 'border-gray-300 focus:ring-secondary focus:border-secondary';

    const disabledClass = this.disabled ? 'bg-gray-100 cursor-not-allowed opacity-60' : 'bg-white';

    return `${baseClasses} ${sizeClasses[this.size]} ${stateClasses} ${disabledClass}`;
  }

  onInputChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value = target.value;
    this.onChange(this.value);
    this.valueChange.emit(this.value);
  }

  onBlur(): void {
    this.onTouched();
  }

  // ControlValueAccessor implementation
  writeValue(value: string): void {
    this.value = value || '';
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}