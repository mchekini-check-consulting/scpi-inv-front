import {Component, Input, OnInit} from '@angular/core';
import {RepartitionItem} from '../../../../models/scpi-repartition.model';
import {CommonModule} from '@angular/common';
import {ChartModule} from 'primeng/chart';


@Component({
  selector: 'app-sectoral-repartition',
  standalone: true,
  imports: [CommonModule, ChartModule],
  templateUrl: './sectoral-repartition.component.html',
  styleUrls: ['./sectoral-repartition.component.scss'],
})
export class SectoralRepartitionComponent implements OnInit {
  @Input() sectoralData: RepartitionItem[] = [];
  sectoralChartData: any;
  chartOptions: any;

  ngOnInit(): void {
    this.setChartOptions();
    this.prepareSectoralChart();
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
          ],
          hoverBackgroundColor: [
            '#E57373',
            '#F06292',
            '#BA68C8',
            '#9575CD',
            '#7986CB',
            '#64B5F6',
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
              return `${label}: ${value.toFixed(1)}%`;
            },
          },
        },
      },
      responsive: true,
      maintainAspectRatio: false,
    };
  }
}
