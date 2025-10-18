import { Component, Input } from '@angular/core';

import { CommonModule } from '@angular/common';
import { LabelSize } from '../../../../types/ui/label.types';

@Component({
  selector: 'app-label',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './label.component.html',
  styleUrl: './label.component.scss'
})
export class LabelComponent {
  @Input() size: LabelSize = 'md'
  @Input() htmlFor: string = ''
  @Input() text: string = ''
  @Input() required: boolean = false;

  get labelClasses(): string {

    const baseClasses = "font-medium text-gray-700 block mb-1"

    const sizeClasses : Record<LabelSize, string> = {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
    };

    return `${baseClasses} ${sizeClasses[this.size]}`
  }
}
