import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvestmentService } from '../../../../services/investment.service';
import { PortfolioSummary } from '../../../../models/scpi-investment.model';
import { FormatFieldPipe } from '../../../../core/pipe/format-field.pipe';

@Component({
  selector: 'app-portfolio-summary',
  standalone: true,
  imports: [CommonModule, FormatFieldPipe],
  templateUrl: './portfolio-summary.component.html',
  styleUrl: './portfolio-summary.component.scss',
})
export class PortfolioSummaryComponent implements OnInit {
  portfolio: PortfolioSummary | null = null;
  loading = false;
  firstInvestmentDate: Date | null = null;

  constructor(private investmentService: InvestmentService) {}

  ngOnInit(): void {
    this.loadPortfolio();
  }

  loadPortfolio(): void {
    this.loading = true;
    this.investmentService.getMyPortfolio('date').subscribe({
      next: (data) => {
        this.portfolio = data;
        if (data.investments && data.investments.length > 0) {
          const dates = data.investments.map(
            (inv) => new Date(inv.investmentDate)
          );
          this.firstInvestmentDate = new Date(
            Math.min(...dates.map((d) => d.getTime()))
          );
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement du portefeuille', err);
        this.loading = false;
      },
    });
  }

  getFirstInvestmentLabel(): string {
    if (!this.firstInvestmentDate) {
      return 'Aucun investissement';
    }

    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
    };

    return `Depuis ${this.firstInvestmentDate.toLocaleDateString(
      'fr-FR',
      options
    )}`;
  }
}
