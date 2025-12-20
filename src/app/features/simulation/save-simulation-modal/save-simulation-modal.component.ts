import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-save-simulation-modal',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './save-simulation-modal.component.html',
  styleUrl: './save-simulation-modal.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class SaveSimulationModalComponent {
  @Input() initialName = '';
  @Input() required = true;

  @Output() confirm = new EventEmitter<string | null>();
  @Output() cancel = new EventEmitter<void>();

  name = '';
  error: string | null = null;

  ngOnInit(): void {
    this.name = this.initialName ?? '';
  }

  onConfirm(): void {
    const trimmed = this.name.trim();

    if (this.required && !trimmed) {
      this.error = 'Le nom de la simulation est obligatoire.';
      return;
    }

    this.error = null;
    this.confirm.emit(trimmed ? trimmed : null);
  }
}
