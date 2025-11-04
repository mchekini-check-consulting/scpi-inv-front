import { Component, Input, OnInit} from '@angular/core';
import { ScpiRepartition } from '../../../../models/scpi-repartition.model';
import { ScpiService } from '../../../../services/scpi.service';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-scpi-repartition',
  standalone: true,
  imports: [CommonModule, ChartModule],
  templateUrl: './scpi-repartition.component.html',
  styleUrl: './scpi-repartition.component.scss',

})
export class ScpiRepartitionComponent implements OnInit {
  @Input() scpiId!: number;

  geographicalData: any;
  sectoralData: any;
  chartOptions: any;

  constructor(private scpiService: ScpiService) {}

  ngOnInit(): void {
    this.loadRepartition();
    this.setChartOptions();
  }

  loadRepartition(): void {
    this.scpiService.getScpiRepartition(this.scpiId).subscribe({
      next: (data: ScpiRepartition) => {
        this.prepareGeographicalChart(data);
        this.prepareSectoralChart(data);
      },
      error: (err: any) => {
        console.error('Erreur lors du chargement de la répartition:', err);
      }
    });
  }

  prepareGeographicalChart(data: ScpiRepartition): void {
    const labels = data.geographical.map(item => item.label);
    const values = data.geographical.map(item => item.percentage);

    this.geographicalData = {
      labels: labels,
      datasets: [
        {
          data: values,
          backgroundColor: [
            '#42A5F5',
            '#66BB6A',
            '#FFA726',
            '#FFCA28',
            '#AB47BC',
            '#26C6DA'
          ],
          hoverBackgroundColor: [
            '#64B5F6',
            '#81C784',
            '#FFB74D',
            '#FFD54F',
            '#BA68C8',
            '#4DD0E1'
          ]
        }
      ]
    };
  }

  prepareSectoralChart(data: ScpiRepartition): void {
    const labels = data.sectoral.map(item => item.label);
    const values = data.sectoral.map(item => item.percentage);

    this.sectoralData = {
      labels: labels,
      datasets: [
        {
          data: values,
          backgroundColor: [
            '#EF5350',
            '#EC407A',
            '#AB47BC',
            '#7E57C2',
            '#5C6BC0',
            '#42A5F5'
          ],
          hoverBackgroundColor: [
            '#E57373',
            '#F06292',
            '#BA68C8',
            '#9575CD',
            '#7986CB',
            '#64B5F6'
          ]
        }
      ]
    };
  }

  setChartOptions(): void {
    this.chartOptions = {
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            usePointStyle: true,
            padding: 15
          }
        },
        tooltip: {
          callbacks: {
            label: (context: any) => {
              const label = context.label || '';
              const value = context.parsed || 0;
              return `${label}: ${value.toFixed(1)}%`;
            }
          }
        }
      },
      responsive: true,
      maintainAspectRatio: false
    };
  }
}
