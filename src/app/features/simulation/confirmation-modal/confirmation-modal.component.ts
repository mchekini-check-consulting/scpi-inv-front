import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-confirmation-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirmation-modal.component.html',
  styleUrl: './confirmation-modal.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class ConfirmationModalComponent {
    @Output() confirm = new EventEmitter<void>()
  @Output() cancel = new EventEmitter<void>()

}
