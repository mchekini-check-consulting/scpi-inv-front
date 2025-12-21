import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { Subject, takeUntil } from 'rxjs';
import { InvestmentService } from '../../../../core/service/investment.service';
import { MonthlyRevenue } from '../../../../core/model/investment.model';


@Component({
  selector: 'app-revenus-mensuels',
  standalone: true,
  imports: [CommonModule, ChartModule],
  templateUrl: './revenus-mensuels.component.html',
  styleUrls: ['./revenus-mensuels.component.scss']
})
export class RevenusMensuelsComponent implements OnInit, OnDestroy {
  revenue: MonthlyRevenue | null = null;
  chartData: any;
  chartOptions: any;
  loading = false;

  private destroy$ = new Subject<void>();

  constructor(private investmentService: InvestmentService) {}

  ngOnInit(): void {
    this.initializeChart();
    this.loadRevenue();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadRevenue(): void {
    this.loading = true;

    this.investmentService
      .getMonthlyRevenue()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.revenue = data;

          if (data.history && data.history.length > 0) {
            this.prepareChartDataFromHistory(data.history);
          }

          this.loading = false;
        },
        error: (err) => {
          console.error('Erreur lors du chargement des revenus mensuels:', err);
          this.loading = false;
        }
      });
  }

  prepareChartDataFromHistory(history: any[]): void {

    const labels = history.map(h => this.getMonthLabel(h.month));
    const data = history.map(h => h.revenue);

    this.chartData = {
      labels: labels,
      datasets: [
        {
          label: 'Revenus mensuels',
          data: data,
          fill: true,
          backgroundColor: 'rgba(239, 68, 68, 0.2)',
          borderColor: '#EF4444',
          tension: 0.4,
          pointBackgroundColor: '#EF4444',
          pointBorderColor: '#fff',
          pointRadius: 6,
          pointHoverRadius: 8,
        }
      ]
    };
  }

  getMonthLabel(month: number): string {
    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin',
                    'Juil', 'Août', 'Sept', 'Oct', 'Nov', 'Déc'];
    return months[month - 1] || '';
  }

  initializeChart(): void {
    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: (context: any) => {
              return `${context.parsed.y.toFixed(2)} €`;
            }
          }
        }
      },
      scales: {
        x: {
          grid: {
            display: true,
            color: '#e5e7eb',
            drawBorder: false,
          },
          ticks: {
            color: '#6b7280',
          },
        },
        y: {
          grid: {
            display: true,
            color: '#e5e7eb',
            drawBorder: false,
          },
          ticks: {
            color: '#9CA3AF',
            callback: function(value: any) {
              return value + ' €';
            }
          },
          beginAtZero: true
        }
      }
    };
  }

  calculateVariation(): string {
    if (!this.revenue || !this.revenue.history || this.revenue.history.length < 2) {
      return '0%';
    }

    const history = this.revenue.history;
    const currentMonth = history[history.length - 1].revenue;
    const previousMonth = history[history.length - 2].revenue;

    if (previousMonth === 0) {
      return '0%';
    }

    const variation = ((currentMonth - previousMonth) / previousMonth) * 100;
    const sign = variation >= 0 ? '+' : '';
    return `${sign}${variation.toFixed(1)}%`;
  }
}
