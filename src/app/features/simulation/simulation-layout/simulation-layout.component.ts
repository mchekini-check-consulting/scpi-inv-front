import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ScpiService } from '../../../services/scpi.service';
import { GeographicChartComponent } from '../geographic-chart/geographic-chart.component';
import { ScpiSelectionModalComponent } from '../scpi-selection-modal/scpi-selection-modal.component';
import { ScpiSimulator, SimulationSummary } from '../../../models/scpi-simulator.model';
import { PortfolioManagementComponent } from "../portfolio-management/portfolio-management.component";

interface CountryData {
  name: string;
  amount: number;
  percentage: number;
}

@Component({
  selector: 'app-simulation-layout',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    GeographicChartComponent,
    ScpiSelectionModalComponent,
    PortfolioManagementComponent
],
  templateUrl: './simulation-layout.component.html',
  styleUrl: './simulation-layout.component.scss',
})
export class SimulationLayoutComponent implements OnInit {
  summary: SimulationSummary = {
    totalInvestment: 0,
    grossRevenue: 0,
    netRevenue: 0,
    totalScpis: 0,
    taxRate: 30,
  };

  francePercentage: number = 33.3;
  europePercentage: number = 66.7;
  
  countries: CountryData[] = [
    { name: 'France', amount: 5000, percentage: 33.3 },
    { name: 'Espagne', amount: 10000, percentage: 66.7 }
  ];

  tmiValue: number = 30;
  defaultTmi: number = 30;
  taxableIncome: number = 0;
  incomeTax: number = 0;
  socialTax: number = 0;
  showAddModal: boolean = false;
  saveWithModifications: boolean = false;

  editingItem: any = null;
  constructor(
    private scpiService: ScpiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.scpiService.portfolio$.subscribe(() => {
      this.updateSummary();
      this.updateGeographicData();
      this.calculateTaxes();
    });
  }

  private updateSummary(): void {
    this.summary = this.scpiService.getSummary();
  }

  private updateGeographicData(): void {
    const total = this.summary.totalInvestment;
    
    if (total > 0) {
      this.countries = [
        { 
          name: 'France', 
          amount: total * 0.333, 
          percentage: 33.3 
        },
        { 
          name: 'Espagne', 
          amount: total * 0.667, 
          percentage: 66.7 
        }
      ];

      this.francePercentage = 33.3;
      this.europePercentage = 66.7;
    }
  }

  private calculateTaxes(): void {
    const gross = this.summary.grossRevenue;
    this.taxableIncome = gross;
    
    this.incomeTax = -(gross * (this.tmiValue / 100));
    
    this.socialTax = -(gross * 0.172);
    
    this.summary.netRevenue = gross + this.incomeTax + this.socialTax;
  }

  updateTmi(): void {
    this.calculateTaxes();
    console.log(`TMI changée à : ${this.tmiValue}%`);
  }

  addToPortfolio(event: { scpi: ScpiSimulator; shares: number }): void {
    console.log('SCPI à ajouter:', event.scpi.name, 'Parts:', event.shares);
    this.onOpenAddModal(false);
  }

  onOpenAddModal(isOpen: boolean): void {
    this.showAddModal = isOpen;
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Math.abs(value));
  }

  goBack(): void {
    this.router.navigate(['/dashboard/simulation']);
  }

  saveSimulation(): void {
    console.log('Sauvegarder la simulation', {
      summary: this.summary,
      tmiValue: this.tmiValue,
      saveWithModifications: this.saveWithModifications
    });
  }

  
}