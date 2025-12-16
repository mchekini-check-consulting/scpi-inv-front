import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ScpiService } from '../../../core/service/scpi.service';
import { SimulationStateService } from '../../../core/service/simulationState.service';
import { SimulationResponseDTO } from '../../../core/model/scpi-simulator.model';
import { FormatFieldPipe } from '../../../core/pipe/format-field.pipe';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ConfirmationModalComponent } from "../confirmation-modal/confirmation-modal.component";

@Component({
  selector: 'app-simulation-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormatFieldPipe, ToastModule, ConfirmationModalComponent],
  providers: [MessageService],
  templateUrl: './simulation-list.component.html',
  styleUrl: './simulation-list.component.scss'
})
export class SimulationListComponent implements OnInit {
  simulations: SimulationResponseDTO[] = [];
  isLoading = true;
  selectedSimulation: SimulationResponseDTO | null = null;
  showDeleteModal = false;

  constructor(
    private router: Router,
    private scpiService: ScpiService,
    private simulationState: SimulationStateService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadSimulations();
  }

  loadSimulations(): void {
    this.isLoading = true;

    this.scpiService.getSimulations().subscribe({
      next: (simulations: SimulationResponseDTO[]) => {
        this.simulations = simulations;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur chargement simulations:', err);
        this.isLoading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Impossible de charger vos simulations'
        });
      }
    });
}

 openSimulation(simulation: SimulationResponseDTO): void {
  localStorage.setItem('currentSimulationId', simulation.id!.toString());
  this.router.navigate(['/dashboard/simulation/nouvelle']);
}

  confirmDelete(simulation: SimulationResponseDTO, event: Event): void {
    event.stopPropagation();
    this.selectedSimulation = simulation;
    this.showDeleteModal = true;
  }

  deleteSimulation(): void {
    if (!this.selectedSimulation?.id) return;

    this.scpiService.deleteSimulation(this.selectedSimulation.id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Simulation supprimée',
          detail: `La simulation "${this.selectedSimulation?.name}" a été supprimée.`,
          life: 3000
        });

        this.loadSimulations();
        this.closeDeleteModal();
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Impossible de supprimer la simulation.'
        });
        this.closeDeleteModal();
      }
    });
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.selectedSimulation = null;
  }


  goBack(): void {
    this.router.navigate(['/dashboard/simulation']);
  }

  getScpiCount(simulation: SimulationResponseDTO): number {
    return simulation.items?.length || 0;
  }

  editSimulation(simulation: SimulationResponseDTO, event: Event): void {
    event.stopPropagation(); 

    this.simulationState.setSimulationFromResponseDTO(simulation);

    localStorage.setItem('currentSimulationId', simulation.id!.toString());

    this.router.navigate(['/dashboard/simulation/nouvelle']);
  }

  startNewSimulation() {
    this.simulationState.resetSimulationState();
    this.router.navigate(['/dashboard/simulation/nouvelle']);
}


}