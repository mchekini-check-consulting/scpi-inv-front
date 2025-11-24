import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioSummary } from '../../../../models/scpi-investment.model';
import { InvestmentService } from '../../../../services/investment.service';
import { FormatFieldPipe } from '../../../../core/pipe/format-field.pipe';


@Component({
  selector: 'app-liste-investissements',
  standalone: true,
  imports: [CommonModule, FormatFieldPipe],
  templateUrl: './liste-investissements.component.html',
  styleUrl: './liste-investissements.component.scss'
})
export class ListeInvestissementsComponent implements OnInit {
  portfolio: PortfolioSummary | null = null;
  sortBy: 'date' | 'amount' = 'date';
  loading = false;

  constructor(private investmentService: InvestmentService) {}

  ngOnInit(): void {
    this.loadPortfolio();
  }

  loadPortfolio(): void {
    this.loading = true;
    this.investmentService.getMyPortfolio(this.sortBy).subscribe({
      next: (data) => {
        this.portfolio = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement du portefeuille', err);
        this.loading = false;
      }
    });
  }

  changeSortBy(sortBy: 'date' | 'amount'): void {
    this.sortBy = sortBy;
    this.loadPortfolio();
  }

  getInvestmentTypeLabel(type: string): string {
    const labels: { [key: string]: string } = {
      'FULL_OWNERSHIP': 'Pleine propriété',
      'BARE_OWNERSHIP': 'Nue-propriété',
      'USUFRUCT': 'Usufruit'
    };
    return labels[type] || type;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { 
      day: '2-digit', 
      month: 'long', 
      year: 'numeric' 
    });
  }
}