import { Component, Input } from '@angular/core';
import { BadgeVariant } from '../../../../types/ui/badge.types'

@Component({
  selector: 'app-badge',
  standalone: true,
  imports: [],
  templateUrl: './badge.component.html',
  styleUrl: './badge.component.scss'
})
export class BadgeComponent {
  
  @Input({ required: true }) label!: string;
  @Input() variant: BadgeVariant = 'success';

  get variantClasses(): string {
    const variants = {
      success: 'bg-secondary text-white',
      primary: 'bg-blue-600 text-white',
      warning: 'bg-yellow-500 text-gray-900',
      danger: 'bg-red-600 text-white',
      info: 'bg-gray-600 text-white'
    };
    
    return variants[this.variant];
  }
}
