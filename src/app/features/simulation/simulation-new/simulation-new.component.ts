import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PortfolioScpisComponent } from '../portfolio-scpis/portfolio-scpis.component';
import { ScpiService } from '../../../services/scpi.service';

interface PortfolioScpi {
  id: number;
  name: string;
  sector: string;
  pricePerShare: number;
  yield: number | null;
  shares: number;
  amount: number;
}

@Component({
  selector: 'app-simulation-new',
  standalone: true,
  imports: [CommonModule, FormsModule, CurrencyPipe, PortfolioScpisComponent],
  templateUrl: './simulation-new.component.html',
  styleUrl: './simulation-new.component.scss'
})
export class SimulationNewComponent implements OnInit {
  scpis: PortfolioScpi[] = [];
  availableScpis: PortfolioScpi[] = [];

  showAddModal = false;
  selectedScpi: PortfolioScpi | null = null;
  newShares = 1;

  constructor(private scpiService: ScpiService) {}

  ngOnInit(): void {
    this.loadAvailableScpis();
  }

  private loadAvailableScpis(): void {
    this.scpiService.getScpiForSimulator().subscribe({
      next: (backendScpis) => {
        this.availableScpis = backendScpis
          .filter(s => s.sharePrice != null && s.yieldDistributionRate != null)
          .map(s => ({
            id: s.id,
            name: s.name,
            sector: this.getMainSector(s.sectors),
            pricePerShare: s.sharePrice!,
            yield: s.yieldDistributionRate!,
            shares: 0,
            amount: 0
          } as PortfolioScpi))
          .sort((a, b) => (b.yield || 0) - (a.yield || 0));

        console.log('SCPI chargées pour le simulateur :', this.availableScpis);
      },
      error: (err) => {
        console.error('Erreur chargement SCPI', err);
      }
    });
  }

  private getMainSector(sectors: { label: string; percentage: number }[]): string {
    if (!sectors || sectors.length === 0) return 'Diversifiée';
    return sectors.reduce((prev, curr) =>
      prev.percentage > curr.percentage ? prev : curr
    ).label;
  }

  get totalAmount(): number {
    return this.scpis.reduce((sum, s) => sum + s.amount, 0);
  }

  openAddModal() {
    this.showAddModal = true;
    this.selectedScpi = null;
    this.newShares = 1;
  }

  addScpi() {
    if (this.selectedScpi && this.newShares > 0) {
      const amount = this.selectedScpi.pricePerShare * this.newShares;

      const existing = this.scpis.find(s => s.id === this.selectedScpi!.id);
      if (existing) {
        existing.shares += this.newShares;
        existing.amount += amount;
      } else {
        this.scpis.push({
          ...this.selectedScpi,
          shares: this.newShares,
          amount
        });
      }
      this.showAddModal = false;
      this.newShares = 1;
    }
  }

  removeScpi(scpiToRemove: PortfolioScpi) {
    this.scpis = this.scpis.filter(s => s.id !== scpiToRemove.id);
  }

  updateShares(event: { scpi: PortfolioScpi; shares: number }) {
    const scpi = this.scpis.find(s => s.id === event.scpi.id);
    if (scpi) {
      scpi.shares = event.shares;
      scpi.amount = scpi.shares * scpi.pricePerShare;
    }
  }
}