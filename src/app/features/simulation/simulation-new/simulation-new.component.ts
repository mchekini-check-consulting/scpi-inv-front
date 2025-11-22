import { Component } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PortfolioScpisComponent } from '../portfolio-scpis/portfolio-scpis.component';

interface Scpi {
  name: string;
  sector: string;
  amount: number;
  shares: number;
  pricePerShare: number;
  yield: number;
}

@Component({
  selector: 'app-simulation-new',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CurrencyPipe,
    PortfolioScpisComponent   // ← le composant séparé
  ],
  templateUrl: './simulation-new.component.html',
  styleUrl: './simulation-new.component.scss'
})
export class SimulationNewComponent {

  // Liste des SCPI déjà dans le portefeuille
  scpis: Scpi[] = [
    // Exemples pour tester
    { name: 'SCPI Immobilière Santé', sector: 'Healthcare', amount: 50000, shares: 100, pricePerShare: 500, yield: 4.2 },
    { name: 'SCPI Bureaux Prime', sector: 'Offices', amount: 30000, shares: 60, pricePerShare: 500, yield: 3.8 }
  ];

  // SCPI disponibles à ajouter (exemple)
  availableScpis = [
    { name: 'SCPI Épargne Pierre', sector: 'Diversifiée', pricePerShare: 208, yield: 5.1 },
    { name: 'SCPI Corum Origin', sector: 'Europe', pricePerShare: 1135, yield: 6.2 },
    { name: 'SCPI ActivImmo', sector: 'Logistique', pricePerShare: 610, yield: 5.8 },
    { name: 'SCPI Primopierre', sector: 'Bureaux', pricePerShare: 208, yield: 4.3 }
  ];

  // Modal
  showAddModal = false;
  selectedScpi: any = null;
  newShares = 1;

  // Calcul du total investi
  get totalAmount(): number {
    return this.scpis.reduce((sum, s) => sum + s.amount, 0);
  }

  // === ACTIONS ===
  openAddModal() {
    this.showAddModal = true;
    this.selectedScpi = null;
    this.newShares = 1;
  }

  addScpi() {
    if (this.selectedScpi && this.newShares > 0) {
      const amount = this.selectedScpi.pricePerShare * this.newShares;
      this.scpis.push({
        ...this.selectedScpi,
        amount,
        shares: this.newShares
      });
      this.showAddModal = false;
    }
  }

  removeScpi(scpiToRemove: Scpi) {
    this.scpis = this.scpis.filter(s => s !== scpiToRemove);
  }

  updateShares(event: { scpi: Scpi; shares: number }) {
    const scpi = event.scpi;
    scpi.shares = event.shares;
    scpi.amount = scpi.shares * scpi.pricePerShare;
  }
}