import {
  Component,
  ChangeDetectorRef,
  OnInit,
  inject,
  PLATFORM_ID,
  Input,
} from '@angular/core';
import { ChartModule, UIChart } from 'primeng/chart';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ScpiService } from '../../../services/scpi.service';
import { DistributionRateChartResponse } from '../../../models/distribution-rate.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-performance-history',
  standalone: true,
  imports: [CommonModule, ChartModule, UIChart],
  templateUrl: './performance-history.component.html',
  styleUrls: ['./performance-history.component.scss'],
})
export class PerformanceHistoryComponent implements OnInit {
  @Input() scpiId?: number;
  data: any;
  options: any;
  isLoading = true;
  insufficientHistory = false;
  platformId = inject(PLATFORM_ID);
  average3Years: number | null = null;

  constructor(
    private scpiService: ScpiService,
    private route: ActivatedRoute,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initChartOptions();
    this.loadChartData(this.scpiId);
  }

  private initChartOptions(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.options = {
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              color: '#374151',
              font: { family: 'Inter', size: 14, weight: '600' },
              usePointStyle: true,
              padding: 12,
              margin: 1,
            },
          },

          tooltip: {
            backgroundColor: '#7BB274',
            titleColor: '#0a0a0aff',
            bodyColor: '#0c0c0cff',
            padding: 10,
            cornerRadius: 8,
            callbacks: {
              label: (tooltipItem: any) =>
                `${tooltipItem.dataset.label}: ${tooltipItem.formattedValue} %`,
            },
          },
        },
        scales: {
          x: {
            ticks: { color: '#6b7280', font: { size: 13, weight: '500' } },
            grid: { display: false },
          },
          y: {
            beginAtZero: true,
            ticks: {
              color: '#6b7280',
              font: { size: 12 },
              callback: (value: any) => `${value}%`,
            },
            grid: { color: 'rgba(107, 114, 128, 0.1)', borderDash: [4, 4] },
          },
        },
      };
    }
  }

  private loadChartData(scpiId?: number): void {
    this.scpiService.getDistributionRatesChart(scpiId).subscribe({
      next: (response: DistributionRateChartResponse) => {
        const sortedRates = response.rates.sort(
          (a, b) => a.distributionYear - b.distributionYear
        );

        const rates = sortedRates.map((r) => r.rate);
        const years = sortedRates.map((r) => r.distributionYear);

        const last3Rates = sortedRates.slice(-3);
        this.average3Years =
          last3Rates.reduce((sum, r) => sum + r.rate, 0) / last3Rates.length;

        this.insufficientHistory = rates.length < 2;
        if (this.insufficientHistory) {
          this.isLoading = false;
          this.cd.markForCheck();
          return;
        }

        this.data = {
          labels: years,
          datasets: [
            {
              type: 'bar',
              label: 'Rendement annuel',
              data: rates,
              backgroundColor: '#2d5f2e',
              borderRadius: 4,
              barThickness: 40,
              borderSkipped: false,
              hoverBackgroundColor: '#234a24',
            },
          ],
        };

        this.isLoading = false;
        this.cd.markForCheck();
      },
      error: (err) => {
        console.error('Erreur API:', err);
        this.isLoading = false;
        this.cd.markForCheck();
      },
    });
  }
}
