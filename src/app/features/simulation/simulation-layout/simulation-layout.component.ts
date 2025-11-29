import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { GeographicChartComponent } from '../geographic-chart/geographic-chart.component';
import { ScpiSelectionModalComponent } from '../scpi-selection-modal/scpi-selection-modal.component';
import { PortfolioManagementComponent } from '../portfolio-management/portfolio-management.component';
import { FormatFieldPipe } from '../../../core/pipe/format-field.pipe';
import { ScpiSimulator, SimulationSummary } from '../../../models/scpi-simulator.model';
import { SimulationStateService } from '../../../services/simulationState.service';
import { ScpiService } from '../../../services/scpi.service';

@Component({
  selector: 'app-simulation-layout',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    GeographicChartComponent,
    ScpiSelectionModalComponent,
    PortfolioManagementComponent,
    FormatFieldPipe
  ],
  templateUrl: './simulation-layout.component.html',
  styleUrl: './simulation-layout.component.scss',
})
export class SimulationLayoutComponent implements OnInit {

  summary!: SimulationSummary;

  tmiValue = 30;
  simulationName = 'Nouvelle simulation';

  countries: any[] = [];
  showAddModal = false;

  taxableIncome = 0;
  incomeTax = 0;
  socialTax = 0;

  constructor(
    private router: Router,
    private simulationState: SimulationStateService,
    private scpiService: ScpiService
  ) {}

  ngOnInit(): void {
  this.simulationState.summary$.subscribe(summary => {
    this.summary = summary;
    this.tmiValue = summary.taxRate;
    this.simulationName = summary.name;
    this.updateGeography();
    this.recalculateTax();
  });

  const savedId = this.simulationState.getSummarySnapshot().id 
                  ?? localStorage.getItem('currentSimulationId');
  if (savedId) {
    this.scpiService.getSimulationById(+savedId).subscribe(sim => {
      this.simulationState.setSimulationFromResponseDTO(sim);
    });
  }
}


  onNameChange() {
    this.simulationState.setSimulationName(this.simulationName);
  }

  updateGeography() {
    const total = this.summary.totalInvestment;
    if (total <= 0) {
      this.countries = [];
      return;
    }

    this.countries = [
      { name: 'France', amount: total * 0.33, percentage: 33 },
      { name: 'Espagne', amount: total * 0.67, percentage: 67 }
    ];
  }

  recalculateTax() {
    const gross = this.summary.grossRevenue;
    const tmi = this.summary.taxRate;

    this.taxableIncome = gross;
    this.incomeTax = -(gross * (tmi / 100));
    this.socialTax = -(gross * 0.172);
  }

  updateTmi() {
    this.simulationState.setTmi(this.tmiValue);
  }

  onOpenAddModal(open: boolean) {
    this.showAddModal = open;
  }

  onAddScpi(event: { scpi: ScpiSimulator; shares: number }) {
    this.simulationState.addOrUpdateScpi(event.scpi, event.shares);
    this.showAddModal = false;
  }


  saveSimulation() {
  const portfolio = this.simulationState.getPortfolioSnapshot();
  const summary = this.simulationState.getSummarySnapshot();

  if (!portfolio || portfolio.length === 0) {
    alert('Veuillez ajouter au moins une SCPI avant de sauvegarder.');
    return;
  }

  const payload = {
    id: summary.id, 
    name: summary.name,
    taxRate: summary.taxRate,
    items: portfolio.map(p => ({
      scpiId: p.scpi.id,
      shares: p.shares
    }))
  };

  this.scpiService.saveSimulation(payload).subscribe({
    next: res => {
      alert('Simulation sauvegardée');
      if (!summary.id) {
        this.simulationState.setSimulationId(res.id);
      }
          localStorage.setItem('currentSimulationId', res.id!.toString());

    },
    error: err => {
      console.error(err);
      alert('Erreur lors de la sauvegarde');
    }
  });
}


  goBack() {
    this.router.navigate(['/dashboard/simulation']);
  }
}
