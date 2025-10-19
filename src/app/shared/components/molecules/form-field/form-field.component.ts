import { Component, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { LabelComponent } from '../../atoms/label/label.component';
import { InputComponent } from '../../atoms/input/input.component';
import { InputSize, InputType } from '../../../../types/ui/input.types';


@Component({
  selector: 'app-form-field',
  standalone: true,
  imports: [CommonModule, LabelComponent, InputComponent],
  templateUrl: './form-field.component.html',
  styleUrl: './form-field.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormFieldComponent),
      multi: true
    }
  ]
})
export class FormFieldComponent implements ControlValueAccessor {
  @Input() label: string = '';
  @Input() type: InputType = 'text';
  @Input() placeholder: string = '';
  @Input() required: boolean = false;
  @Input() disabled: boolean = false;
  @Input() error: boolean = false;
  @Input() errorMessage: string = '';
  @Input() size: InputSize = 'md';
  @Input() inputId: string = '';

  value: string = '';

  // ControlValueAccessor methods
  onChange: any = () => {};
  onTouched: any = () => {};

  onInputChange(newValue: string): void {
    this.value = newValue;
    this.onChange(newValue);
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