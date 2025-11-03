import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Scpi } from '../../../../models/scpi.model';
import { Router, RouterLink } from '@angular/router';


@Component({
  selector: 'app-scpi-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './scpi-card.component.html',
  styleUrl: './scpi-card.component.scss'
})
export class ScpiCardComponent {
  @Input() scpi!: Scpi;
  
  constructor(private router: Router) {}

  onViewMore(): void {
    console.log("--->", this.scpi);
    
  }

  onInvest(): void {
    this.router.navigate(['/dashboard/scpi', this.scpi.id, 'invest']);
  }

getCountryCode(country: string): string {
  const codes: { [key: string]: string } = {
    'France': 'FR',
    'Pays-Bas': 'NL',
    'Allemagne': 'DE',
    'Espagne': 'ES',
    'Italie': 'IT',
    'Belgique': 'BE',
    'Portugal': 'PT',
    'Luxembourg': 'LU',
    'Suisse': 'CH',
    'Royaume-Uni': 'GB',
    'Irlande': 'IE',
    'Europe': 'EU',
  };
  
  return codes[country] || 'EU';
}
}