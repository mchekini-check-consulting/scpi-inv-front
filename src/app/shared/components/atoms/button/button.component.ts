
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonSize, ButtonVariant } from '../../../../types/ui/button.types';


@Component({
  selector: 'app-button',
  standalone: true,
  imports: [],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss'
})
export class ButtonComponent {
  @Input() variant: ButtonVariant = 'primary';
  @Input() size: ButtonSize = 'md';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() disabled: boolean = false;

  @Output() clicked = new EventEmitter<MouseEvent>();

  get buttonClasses(): string {
  const baseClasses = 'font-semibold rounded-lg transition-all duration-200 inline-flex items-center justify-center';
  
  const variantClasses: Record<ButtonVariant, string> = {
    primary: 'bg-secondary text-white hover:bg-tertiary shadow-sm',
    secondary: 'bg-tertiary text-white hover:bg-secondary shadow-sm',
    outline: 'bg-transparent border-2 border-secondary text-secondary ',
    text:'text-secondary'
  };

  const sizeClasses: Record<ButtonSize, string> = {
    sm: 'px-4 py-2 text-sm h-9 min-w-[80px]',
    md: 'px-6 py-2.5 text-base h-11 min-w-[120px]',
    lg: 'px-8 py-3 text-lg h-14 min-w-[140px]'
  };

  const disabledClass = this.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';

  return `${baseClasses} ${variantClasses[this.variant]} ${sizeClasses[this.size]} ${disabledClass}`;
}

  handleClick(event: MouseEvent): void {
    if (!this.disabled) {
      this.clicked.emit(event);
    }
  }

}
