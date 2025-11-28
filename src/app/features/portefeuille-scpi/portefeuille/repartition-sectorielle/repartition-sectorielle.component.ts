import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { InvestmentService } from '../../../../services/investment.service';
import { InvestorPortfolioDistribution, RepartitionItem } from '../../../../models/scpi-investment.model';


@Component({
  selector: 'app-repartition-sectorielle',
  standalone: true,
  imports: [CommonModule, ChartModule],
  templateUrl: './repartition-sectorielle.component.html',
  styleUrls: ['./repartition-sectorielle.component.scss']
})
export class RepartitionSectorielleComponent implements OnInit {
  distribution: InvestorPortfolioDistribution | null = null;
  sectoralChartData: any;
  chartOptions: any;
  loading = false;

  constructor(private investmentService: InvestmentService) {}

  ngOnInit(): void {
    this.setChartOptions();
    this.loadDistribution();
  }

  loadDistribution(): void {
    this.loading = true;
    this.investmentService.getPortfolioDistribution().subscribe({
      next: (data) => {
        this.distribution = data;
        this.prepareSectoralChart(data.sectoral);
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement de la répartition', err);
        this.loading = false;
      }
    });
  }

  prepareSectoralChart(sectoralData: RepartitionItem[]): void {
    this.sectoralChartData = {
      labels: sectoralData.map(item => item.label),
      datasets: [
        {
          data: sectoralData.map(item => item.percentage),
          backgroundColor: [
            '#EF5350', // Rouge
            '#EC407A', // Rose
            '#AB47BC', // Violet
            '#7E57C2', // Violet foncé
            '#5C6BC0', // Indigo
            '#42A5F5', // Bleu
            '#26A69A', // Teal
            '#66BB6A', // Vert
          ],
          hoverBackgroundColor: [
            '#E57373',
            '#F06292',
            '#BA68C8',
            '#9575CD',
            '#7986CB',
            '#64B5F6',
            '#4DB6AC',
            '#81C784',
          ],
        },
      ],
    };
  }

  setChartOptions(): void {
    this.chartOptions = {
      plugins: {
        legend: {
          display: false,
          position: 'bottom',
          labels: { usePointStyle: true, padding: 15 },
        },
        tooltip: {
          callbacks: {
            label: (context: any) => {
              const label = context.label || '';
              const value = context.parsed || 0;
              return `${label}: ${value.toFixed(2)}%`;
            },
          },
        },
      },
      responsive: true,
      maintainAspectRatio: false,
    };
  }

  calculateSectorAmount(percentage: number): number {
    if (!this.distribution) return 0;
    return (this.distribution.totalInvestedAmount * percentage) / 100;
  }
}