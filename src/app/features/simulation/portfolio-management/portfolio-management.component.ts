import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioItem,SimulationResponseDTO } from '../../../models/scpi-simulator.model';
import { RepartitionItem } from '../../../models/scpi-repartition.model';
import { ScpiSelectionModalComponent } from '../scpi-selection-modal/scpi-selection-modal.component';
import { ConfirmationModalComponent } from '../confirmation-modal/confirmation-modal.component';
import { EditSharesModalComponent } from '../edit-shares-modal/edit-shares-modal.component';
import { FormatFieldPipe } from '../../../core/pipe/format-field.pipe';
import { SimulationStateService } from '../../../services/simulationState.service';
import { ScpiService } from '../../../services/scpi.service';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-portfolio-management',
  standalone: true,
  imports: [
    CommonModule,
    ScpiSelectionModalComponent,
    ConfirmationModalComponent,
    EditSharesModalComponent,
    FormatFieldPipe,
     ToastModule
  ],
  templateUrl: './portfolio-management.component.html',
  styleUrl: './portfolio-management.component.scss',
})
export class PortfolioManagementComponent implements OnInit {
  portfolio: PortfolioItem[] = [];
  totalInvestment = 0;

  itemToDelete: PortfolioItem | null = null;


  editingItem: PortfolioItem | null = null;
  showAddModal = false;

  constructor(private simulationState: SimulationStateService, private scpiService:ScpiService , private messageService: MessageService) {}

  ngOnInit(): void {
    let summary = this.simulationState.getSummarySnapshot();
    const savedId = localStorage.getItem('currentSimulationId');

    if (!summary.id && savedId) {
      this.scpiService.getSimulationById(+savedId).subscribe(sim => {
        this.simulationState.setSimulationFromResponseDTO(sim);
      });
    }

    this.simulationState.portfolio$.subscribe(portfolio => {
      this.portfolio = portfolio;
      this.calculateTotal();
    });
  }

  private calculateTotal(): void {
    this.totalInvestment = this.portfolio.reduce(
      (sum, item) => sum + item.amount,
      0
    );
  }

  openAddModal(): void {
    this.showAddModal = true;
  }

  closeAddModal(): void {
    this.showAddModal = false;
  }

  addToPortfolio(event: { scpi: any; shares: number }): void {
    this.simulationState.addOrUpdateScpi(event.scpi, event.shares);
    this.closeAddModal();
      this.messageService.add({
      severity: 'success',
      summary: 'Ajout réussi',
      detail: `${event.scpi.name} ajoutée au portefeuille`,
      life: 2000
    });
  }

  incrementShares(id: string): void {
    const item = this.portfolio.find((p) => p.id === id);
    if (!item) return;

    this.simulationState.updateShares(item.scpi.id, item.shares + 1);
  }

  decrementShares(id: string): void {
    const item = this.portfolio.find((p) => p.id === id);
    if (!item) return;

    const sharePrice = item.scpi.sharePrice ?? 0;
    const minShares =
      sharePrice > 0
        ? Math.ceil((item.scpi.minimumSubscription ?? 0) / sharePrice)
        : 1;

    if (item.shares > minShares) {
      this.simulationState.updateShares(item.scpi.id, item.shares - 1);
    }
  }

  confirmDelete(item: PortfolioItem): void {
    this.itemToDelete = item;
  }

  cancelDelete(): void {
    this.itemToDelete = null;
  }

  deleteScpi(item: PortfolioItem): void {
  const simulationId = this.simulationState.getSummarySnapshot().id;
  if (!simulationId) return;

  this.scpiService.deleteScpiFromSimulation(simulationId, item.scpi.id)
    .subscribe({
      next: (updatedSimulation: SimulationResponseDTO) => {
        this.simulationState.setSimulationFromResponseDTO(updatedSimulation);
        this.itemToDelete = null;
         this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: 'SCPI supprimée du portefeuille'
          });
      },
      error: (err) => {
        console.error('Erreur suppression SCPI:', err);
         this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Impossible de supprimer la SCPI'
          });
      }
    });
}

  openEditSharesModal(item: PortfolioItem): void {
    this.editingItem = item;
  }

updateShares(event: { id: number; shares: number }): void {
  const simulationId = this.simulationState.getSummarySnapshot().id;
  if (!simulationId) return;

  this.scpiService.updateScpiShares(simulationId, event.id, event.shares)
    .subscribe({
      next: (updatedSimulation: SimulationResponseDTO) => {
        this.simulationState.setSimulationFromResponseDTO(updatedSimulation);
        this.editingItem = null;
        this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: 'Nombre de parts mis à jour'
          });
      },
      error: (err) => {
        console.error('Erreur mise à jour parts SCPI :', err);
           this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Impossible de mettre à jour les parts'
          });
      }
    });
}

  getPrimarySector(sectors: RepartitionItem[]): string {
    if (!sectors || sectors.length === 0) return 'Autre';
    return sectors.reduce((prev, curr) =>
      curr.percentage > prev.percentage ? curr : prev
    ).label;
  }

  formatPercentage(value: number): string {
    return value.toFixed(2).replace('.', ',') + ' %';
  }

  getSectorColor(sector: string): string {
    const colors: { [key: string]: string } = {
      Santé: '#10b981',
      Bureaux: '#3b82f6',
      Commerces: '#f59e0b',
      Commerce: '#f59e0b',
      Residentiel: '#8b5cf6',
      Résidentiel: '#8b5cf6',
      Logistique: '#ef4444',
      Hotels: '#06b6d4',
      Hôtellerie: '#06b6d4',
      Locaux: '#64748b',
      "Locaux d'activite": '#94a3b8',
      Transport: '#f97316',
      Autre: '#6b7280',
      Autres: '#6b7280',
    };

    return colors[sector] || '#64748b';
  }
}
