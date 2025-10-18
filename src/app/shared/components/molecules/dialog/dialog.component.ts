import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormFieldComponent } from '../form-field/form-field.component';
import { DialogSize } from '../../../../types/ui/dialog.types';

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [CommonModule, FormFieldComponent],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss',
})
export class DialogComponent implements OnInit {
  @Input() isOpen: boolean = false;
  @Input() title: string = '';
  @Input() size: DialogSize = 'md';
  @Input() showCloseButton: boolean = true;

  @Output() close = new EventEmitter<void>();

  ngOnInit(): void {
    // Empêcher le scroll du body quand le dialog est ouvert
    if (this.isOpen) {
      document.body.style.overflow = 'hidden';
    }
  }

  ngOnChanges(): void {
    if (this.isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }

  ngOnDestroy(): void {
    document.body.style.overflow = 'auto';
  }

  get dialogClasses(): string {
    const sizeClasses: Record<DialogSize, string> = {
      md: 'max-w-md',
      lg: 'max-w-lg',
      xl: 'max-w-xl',
    };

    return `bg-white rounded-lg shadow-xl w-full ${
      sizeClasses[this.size]
    } mx-4`;
  }

  onClose(): void {
    this.close.emit();
  }

  onBackdropClick(event: MouseEvent): void {
    // Fermer seulement si on clique sur le backdrop, pas sur le dialog
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }

 
}
