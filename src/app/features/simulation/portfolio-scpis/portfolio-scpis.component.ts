import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-portfolio-scpis',
  standalone: true,
  imports: [CommonModule, CurrencyPipe,FormsModule],
  templateUrl: './portfolio-scpis.component.html',
  styleUrl: './portfolio-scpis.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class PortfolioScpisComponent {
@Input() scpis: any[] = [];
  @Input() totalScpis = 0;
  @Input() totalAmount = 0;

  @Output() openAddModal = new EventEmitter<void>();
  @Output() removeScpi = new EventEmitter<any>();
  @Output() updateShares = new EventEmitter<{scpi: any, shares: number}>();
}
