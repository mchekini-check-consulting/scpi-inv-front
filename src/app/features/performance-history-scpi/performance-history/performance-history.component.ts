
import { Component, ChangeDetectorRef, OnInit, inject, PLATFORM_ID, Input } from '@angular/core';
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
  @Input() scpiId?:number;
  data: any;
  options: any;
  isLoading = true;
  insufficientHistory = false;
  platformId = inject(PLATFORM_ID);

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
              color:'#0f172a',
              font: { family: 'Inter', size: 14, weight: '600' },
              usePointStyle: true,
              padding: 12,
              margin:1
            },
          },
     
          tooltip: {
            backgroundColor: '#374151',
            titleColor: '#f8fafc',
            bodyColor: '#eaf4ea',
            padding: 10,
            cornerRadius: 8,
            callbacks: {
              label: (tooltipItem: any) => `${tooltipItem.dataset.label}: ${tooltipItem.formattedValue} %`,
            },
          },
        },
        scales: {
          x: {
            ticks: { color: '#374151', font: { size: 13, weight: '500' } },
            grid: { display: false },
          },
          y: {
            beginAtZero: true,
            ticks: { color: '#374151', font: { size: 12 }, callback: (value: any) => `${value}%` },
            grid: { color: 'rgba(55, 65, 81, 0.05)', borderDash: [4, 4] },
          },
        },
      };
    }
  }

private loadChartData(scpiId?: number): void {
  this.scpiService.getDistributionRatesChart(scpiId).subscribe({
    next: (response: DistributionRateChartResponse) => {
      const sortedRates = response.rates.sort((a, b) => a.distributionYear - b.distributionYear);

      const rates = sortedRates.map(r => r.rate);
      const years = sortedRates.map(r => r.distributionYear);

      const last3Rates = sortedRates.slice(-3);
      const avg3Years = last3Rates.reduce((sum, r) => sum + r.rate, 0) / last3Rates.length;

      this.insufficientHistory = rates.length < 2;
      if (this.insufficientHistory) {
        this.isLoading = false;
        this.cd.markForCheck();
        return;
      }

      const avgLine = new Array(rates.length).fill(null);
      const startIndex = rates.length - last3Rates.length;
      for (let i = 0; i < last3Rates.length; i++) {
        avgLine[startIndex + i] = avg3Years;
      }

      this.data = {
        labels: years,
        datasets: [
          {
            type: 'bar',
            label: 'Taux de Distribution (%)',
            data: rates,
            backgroundColor: (context: any) => {
              const chart = context.chart;
              const { ctx, chartArea } = chart;
              if (!chartArea) return '#155eef';
              const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
              gradient.addColorStop(0, '#155eef'); 
              gradient.addColorStop(1, '#6b7280'); 
              return gradient;
            },
            borderRadius: 4,
            barThickness: 50,
            borderSkipped: false,
            hoverBackgroundColor: '#234a24',
          },
          {
            type: 'line',
            label: 'Rendement moyen 3 ans (%)',
            data: avgLine,
            borderColor: '#234a24',
            borderWidth: 3,
            fill: false,
            tension: 0.3,
            pointRadius: 3,
            pointBackgroundColor: '#234a24',
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

