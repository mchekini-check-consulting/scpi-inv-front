import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DecimalPipe, NgFor } from '@angular/common';
import { Scpi } from '../../../models/scpi.model';
import { BadgeComponent } from '../../atoms/badge/badge.component';
import { IconComponent } from '../../atoms/icon/icon.component';
import { CurrencyEuroPipe } from '../../../pipes/currency-pipe';
import { ButtonComponent } from '../../atoms/button/button.component';

@Component({
  selector: 'app-scpi-card',
  standalone: true,
  imports: [NgFor, BadgeComponent, IconComponent, CurrencyEuroPipe, ButtonComponent],
  templateUrl: './scpi-card.component.html',
  styleUrl: './scpi-card.component.scss'
})
export class ScpiCardComponent {
  

  @Input({ required: true }) scpi!: Scpi;


  @Output() invest = new EventEmitter<Scpi>();

 
  @Output() addToWatchlist = new EventEmitter<Scpi>();


  onInvest(): void {
    this.invest.emit(this.scpi);
  }

  onAddToWatchlist(): void {
    console.log("-->", this.scpi);
    
  }
}