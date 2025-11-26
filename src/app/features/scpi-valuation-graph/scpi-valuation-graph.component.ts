import {Component, Input, OnChanges, SimpleChanges} from "@angular/core";
import {CommonModule, CurrencyPipe} from "@angular/common";
import {ScpiDetail} from "../../models/scpi.model";
import {ChartModule} from "primeng/chart";


interface TimelinePoint {
  year: number;
  value: number;
}

@Component({
  selector: 'app-scpi-valuation-timeline',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, ChartModule],
  templateUrl: './scpi-valuation-graph.component.html',
  styleUrls: ['./scpi-valuation-graph.component.scss'],
})
export class ScpiValuationGraphComponent implements OnChanges {
  @Input() scpi!: ScpiDetail;

  chartData: any;
  chartOptions: any;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['scpi'] && this.scpi?.scpiPartValues) {
      this.prepareChartData();
    }
  }

  private prepareChartData(): void {
    const sorted = [...this.scpi.scpiPartValues].sort(
      (a, b) => a.valuationYear - b.valuationYear
    );

    const labels = sorted.map(v => v.valuationYear.toString());
    const sharePrices = sorted.map(v => v.sharePrice);
    const reconstitutionValues = sorted.map(v => v.reconstitutionValue);

    this.chartData = {
      labels: labels,
      datasets: [
        {
          label: 'Prix de part',
          data: sharePrices,
          borderColor: '#42A5F5',
          backgroundColor: 'rgba(66,165,245,0.2)',
          fill: false,
          tension: 0.3
        },
        {
          label: 'Valeur de reconstitution',
          data: reconstitutionValues,
          borderColor: '#66BB6A',
          backgroundColor: 'rgba(102,187,106,0.2)',
          fill: false,
          tension: 0.3
        }
      ]
    };

    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom'
        },
        tooltip: {
          callbacks: {
            label: (context: any) => {
              const label = context.dataset.label || '';
              const value = context.parsed.y || 0;
              return `${label}: ${value.toFixed(2)} €`;
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: false,
          ticks: {
            callback: (value: number) => `${value} €`
          }
        }
      }
    };
  }
}


