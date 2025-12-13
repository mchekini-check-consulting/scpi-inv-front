import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { Subject, takeUntil } from 'rxjs';
import { InvestmentService } from '../../../../core/service/investment.service';
import { MonthlyRevenue } from '../../../../core/model/investment.model';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cumul-revenus',
  standalone: true,
  imports: [CommonModule, ChartModule, DropdownModule, FormsModule],
  templateUrl: './cumul-revenus.component.html',
  styleUrls: ['./cumul-revenus.component.scss'],
})
export class CumulRevenusComponent implements OnInit, OnDestroy {
  revenue: MonthlyRevenue | null = null;
  chartData: any;
  chartOptions: any;
  loading = false;

  selectedYear: number | null = null;
  selectedScpiId: number | null = null;

  years: any[] = [];
  scpis: any[] = [];

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

    // ✅ CHANGEMENT 1 : Utiliser getFullMonthlyRevenueHistory au lieu de getMonthlyRevenue
    this.investmentService
      .getFullMonthlyRevenueHistory(
        this.selectedYear || undefined,
        this.selectedScpiId || undefined
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.revenue = data;

          if (data.history && data.history.length > 0) {
            this.prepareChartDataFromHistory(data.history);
            this.prepareFilters(data);
          }

          this.loading = false;
        },
        error: (err) => {
          console.error('Erreur:', err);
          this.loading = false;
        },
      });
  }

  prepareFilters(data: MonthlyRevenue): void {
    const uniqueYears = [...new Set(data.history.map((h) => h.year))];
    this.years = [
      { label: 'Toutes les années', value: null },
      ...uniqueYears.map((y) => ({ label: y.toString(), value: y })),
    ];

    const scpiMap = new Map<number, string>();
    data.details.forEach((d) => {
      if (d.scpiId && d.scpiName) {
        scpiMap.set(d.scpiId, d.scpiName);
      }
    });

    this.scpis = [
      { label: 'Toutes les SCPI', value: null },
      ...Array.from(scpiMap.entries()).map(([id, name]) => ({
        label: name,
        value: id,
      })),
    ];
  }

  prepareChartDataFromHistory(history: any[]): void {
    // ✅ CHANGEMENT 2 : Inclure l'année dans les labels
    const labels = history.map((h) => this.getMonthLabel(h.month, h.year));

    const cumulativeData: number[] = [];
    let cumul = 0;

    history.forEach((h) => {
      cumul += h.revenue;
      cumulativeData.push(cumul);
    });

    this.chartData = {
      labels: labels,
      datasets: [
        {
          label: 'Cumul des revenus',
          data: cumulativeData,
          fill: true,
          backgroundColor: 'rgba(239, 68, 68, 0.2)',
          borderColor: '#EF4444',
          tension: 0.4,
          pointBackgroundColor: '#EF4444',
          pointBorderColor: '#fff',
          pointRadius: 6,
          pointHoverRadius: 8,
        },
      ],
    };
  }

  // ✅ CHANGEMENT 3 : Ajouter le paramètre year et afficher l'année si différente de l'année actuelle
  getMonthLabel(month: number, year: number): string {
    const months = [
      'Jan',
      'Fév',
      'Mar',
      'Avr',
      'Mai',
      'Juin',
      'Juil',
      'Août',
      'Sept',
      'Oct',
      'Nov',
      'Déc',
    ];

    const currentYear = new Date().getFullYear();
    const monthLabel = months[month - 1] || '';

    // Si l'année est différente de l'année actuelle, afficher l'année
    if (year !== currentYear) {
      return `${monthLabel} ${year}`;
    }

    return monthLabel;
  }

  initializeChart(): void {
    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          callbacks: {
            label: (context: any) => {
              return `Cumul: ${context.parsed.y.toFixed(2)} €`;
            },
          },
        },
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
            color: '#6b7280',
            callback: function (value: any) {
              return value + ' €';
            },
          },
          beginAtZero: true,
        },
      },
    };
  }

  getTotalCumul(): number {
    if (
      !this.revenue ||
      !this.revenue.history ||
      this.revenue.history.length === 0
    ) {
      return 0;
    }

    return this.revenue.totalCumulRevenue || 0;
  }

  onFilterChange(): void {
    this.loadRevenue();
  }

  // ✅ CHANGEMENT 4 : Calculer dynamiquement la date du premier investissement
  getFirstInvestmentDate(): string {
    if (!this.revenue || !this.revenue.history || this.revenue.history.length === 0) {
      return 'l\'origine';
    }

    const firstMonth = this.revenue.history[0];
    const months = [
      'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
      'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'
    ];

    return `${months[firstMonth.month - 1]} ${firstMonth.year}`;
  }
}
