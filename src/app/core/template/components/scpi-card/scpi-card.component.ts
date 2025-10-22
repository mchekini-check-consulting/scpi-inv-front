import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Scpi } from '../../../../models/scpi.model';


@Component({
  selector: 'app-scpi-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './scpi-card.component.html',
  styleUrl: './scpi-card.component.scss'
})
export class ScpiCardComponent {
  @Input() scpi!: Scpi;
  @Output() viewMore = new EventEmitter<void>();
  @Output() invest = new EventEmitter<void>();

  onViewMore(): void {
    this.viewMore.emit();
  }

  onInvest(): void {
    this.invest.emit();
  }
}