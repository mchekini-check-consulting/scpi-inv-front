import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Scpi, ScpiDetail } from '../../../model/scpi.model';
import { Router, RouterLink } from '@angular/router';
import { FormatFieldPipe } from '../../../pipe/format-field.pipe';

@Component({
  selector: 'app-scpi-card',
  standalone: true,
  imports: [CommonModule, FormatFieldPipe],
  templateUrl: './scpi-card.component.html',
  styleUrl: './scpi-card.component.scss',
})
export class ScpiCardComponent {
  @Input() scpi!: Scpi;
  @Input() ScpiDetail!: ScpiDetail;
  @Output() viewMore = new EventEmitter<void>();
  @Output() invest = new EventEmitter<void>();

  constructor(private router: Router) {}
  onViewMore(): void {
    const slug = `${this.scpi.name}-${this.scpi.manager}`;
    this.router.navigate([`/dashboard/scpi/${slug}`]);
  }

  onInvest(): void {
    this.router.navigate(['/dashboard/scpi', this.scpi.id, 'invest']);
  }

  getCountryCode(country: string): string {
    const codes: { [key: string]: string } = {
      France: 'FR',
      'Pays-Bas': 'NL',
      Allemagne: 'DE',
      Espagne: 'ES',
      Italie: 'IT',
      Belgique: 'BE',
      Portugal: 'PT',
      Luxembourg: 'LU',
      Suisse: 'CH',
      'Royaume-Uni': 'GB',
      Irlande: 'IE',
      Europe: 'EU',
    };

    return codes[country] || 'EU';
  }
}
