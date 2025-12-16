import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioItem,SimulationResponseDTO } from '../../../core/model/scpi-simulator.model';
import { RepartitionItem } from '../../../core/model/scpi-repartition.model';
import { ScpiSelectionModalComponent } from '../scpi-selection-modal/scpi-selection-modal.component';
import { ConfirmationModalComponent } from '../confirmation-modal/confirmation-modal.component';
import { EditSharesModalComponent } from '../edit-shares-modal/edit-shares-modal.component';
import { FormatFieldPipe } from '../../../core/pipe/format-field.pipe';
import { SimulationStateService } from '../../../core/service/simulationState.service';
import { ScpiService } from '../../../core/service/scpi.service';
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
  selectedIds: number[] = [];

  constructor(private simulationState: SimulationStateService,
    private scpiService:ScpiService ,
    private messageService: MessageService
  ) {}

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
      this.updateSelectedIds();
    });

  }

  private updateSelectedIds(): void {
    this.selectedIds = this.portfolio.map(p => p.scpi.id);
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
    this.simulationState.updateGlobalFiscality();

    this.messageService.add({
      severity: 'success',
      summary: 'SCPI ajoutée',
      detail: `« ${event.scpi.name} » a bien été ajoutée à votre portefeuille.`,
      life: 2500
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
  const simulationId = this.simulationState.getSummarySnapshot()?.id;

  if (!simulationId) {
    this.simulationState.removeScpi(item.scpi.id);
    this.itemToDelete = null;
    this.simulationState.updateGlobalFiscality();

    this.messageService.add({
      severity: 'success',
      summary: 'SCPI supprimée',
      detail: `La SCPI « ${item.scpi.name} » a été supprimée avec succès de votre portefeuille.`,
    });
    return;
  }

  this.scpiService.deleteScpiFromSimulation(simulationId, item.scpi.id)
    .subscribe({
      next: (updatedSimulation: SimulationResponseDTO | null) => {
        if (updatedSimulation) {
          this.simulationState.setSimulationFromResponseDTO(updatedSimulation);
          this.messageService.add({
            severity: 'success',
            summary: 'SCPI supprimée',
            detail: `La SCPI « ${item.scpi.name} » a été supprimée avec succès de votre simulation.`,
          });

        } else {

          this.simulationState.resetSimulationState();
          localStorage.removeItem('currentSimulationId');
          this.messageService.add({
            severity: 'info',
            summary: 'Simulation supprimée',
            detail: 'La dernière SCPI a été supprimée, la simulation a été supprimée.',
          });
        }

        this.itemToDelete = null;
        this.simulationState.updateGlobalFiscality();
      },
      error: (err) => {
        console.error('Erreur suppression SCPI:', err);
        this.itemToDelete = null;
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Impossible de supprimer la SCPI',
        });
      }
    });
}

  openEditSharesModal(item: PortfolioItem): void {
    this.editingItem = item;
  }

  updateShares(event: { id: number; shares: number }): void {
    this.simulationState.updateShares(event.id, event.shares);
     this.simulationState.updateGlobalFiscality();

    const simulationId = this.simulationState.getSummarySnapshot().id;
    if (!simulationId) return;

    this.scpiService.updateScpiShares(simulationId, event.id, event.shares)
      .subscribe({
        next: (updatedSimulation: SimulationResponseDTO) => {
          this.simulationState.setSimulationFromResponseDTO(updatedSimulation);
          this.editingItem = null;
          this.messageService.add({
              severity: 'success',
              summary: 'Modification réussie',
              detail: `Le nombre de parts a été mis à jour avec succès.`,
            });
        },
        error: (err) => {
          console.error('Erreur mise à jour parts SCPI :', err);
            this.messageService.add({
              severity: 'error',
              summary: 'Échec de la mise à jour',
              detail: `Impossible de modifier le nombre de parts. Veuillez réessayer.`,
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
