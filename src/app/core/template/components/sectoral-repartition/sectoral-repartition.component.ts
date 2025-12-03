import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { RepartitionItem } from '../../../../models/scpi-repartition.model';
import { InvestmentService } from '../../../../services/investment.service';
import { FormatFieldPipe } from '../../../pipe/format-field.pipe';

@Component({
  selector: 'app-sectoral-repartition',
  standalone: true,
  imports: [CommonModule, ChartModule, FormatFieldPipe],
  templateUrl: './sectoral-repartition.component.html',
  styleUrls: ['./sectoral-repartition.component.scss'],
})
export class SectoralRepartitionComponent implements OnInit {

  @Input() sectoralData: RepartitionItem[] = [];
  @Input() loadFromApi: boolean = false;
  @Input() totalAmount: number = 0;
  
  sectoralChartData: any;
  chartOptions: any;
  loading = false;

  constructor(private investmentService: InvestmentService) {}

  ngOnInit(): void {
    this.setChartOptions();
    
    if (this.loadFromApi) {
      this.loadPortfolioDistribution();
    } else {
      this.prepareSectoralChart();
    }
  }

  loadPortfolioDistribution(): void {
    this.loading = true;
    this.investmentService.getPortfolioDistribution().subscribe({
      next: (data) => {
        this.sectoralData = data.sectoral;
        this.totalAmount = data.totalInvestedAmount;
        this.prepareSectoralChart();
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement de la répartition', err);
        this.loading = false;
      }
    });
  }

  prepareSectoralChart(): void {
    this.sectoralChartData = {
      labels: this.sectoralData.map(item => item.label),
      datasets: [
        {
          data: this.sectoralData.map(item => item.percentage),
          backgroundColor: [
            '#EF5350',
            '#EC407A',
            '#AB47BC',
            '#7E57C2',
            '#5C6BC0',
            '#42A5F5',
            '#26A69A',
            '#66BB6A',
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
              
           
              if (this.totalAmount > 0) {
                const amount = this.calculateAmount(value);
                return [
                  `${label}: ${value.toFixed(1)}%`,
                  `${amount.toLocaleString('fr-FR')} €`
                ];
              }
              
              return `${label}: ${value.toFixed(1)}%`;
            },
          },
        },
      },
      responsive: true,
      maintainAspectRatio: false,
    };
  }

  calculateAmount(percentage: number): number {
    if (this.totalAmount === 0) return 0;
    return (this.totalAmount * percentage) / 100;
  }
}