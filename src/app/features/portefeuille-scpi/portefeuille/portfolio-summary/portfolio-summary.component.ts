import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvestmentService } from '../../../../services/investment.service';
import { PortfolioSummary } from '../../../../models/scpi-investment.model';
import { FormatFieldPipe } from '../../../../core/pipe/format-field.pipe';
import { number } from 'echarts';
import { DurationPipe } from '../../../../core/pipe/duration.pipe';

@Component({
  selector: 'app-portfolio-summary',
  standalone: true,
  imports: [CommonModule, FormatFieldPipe, DurationPipe],
  templateUrl: './portfolio-summary.component.html',
  styleUrl: './portfolio-summary.component.scss',
})
export class PortfolioSummaryComponent implements OnInit {
  portfolio: PortfolioSummary | null = null;
  loading = false;
  firstInvestmentDate: Date | null = null;
  averageHoldingMonths : number = 0

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
          this.calculateAverageHoldingPeriod(data.investments);
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

  
  calculateAverageHoldingPeriod(investments: any[]): void {
    if (!investments || investments.length === 0) {
      this.averageHoldingMonths = 0;
      return;
    }

    const totalMonths = investments.reduce((sum, inv) => {
      return sum + (inv.investmentDurationMonths || 0);
    }, 0);

    this.averageHoldingMonths = Math.round(totalMonths / investments.length);
  }
}
