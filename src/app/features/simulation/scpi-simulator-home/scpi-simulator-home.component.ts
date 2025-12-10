import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { SimulationStateService } from '../../../core/service/simulationState.service';

@Component({
  selector: 'app-scpi-simulator-home',
  standalone: true,
  imports: [],
  templateUrl: './scpi-simulator-home.component.html',
  styleUrl: './scpi-simulator-home.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class ScpiSimulatorHomeComponent {

  constructor(private router: Router, private simulationState:SimulationStateService) {

  }
  goToNewSimulation() {
    localStorage.removeItem('currentSimulationId');
    this.simulationState.resetSimulation();
    this.simulationState.resetSimulationState();
    this.router.navigate(['/dashboard/simulation/nouvelle']);
  }

  goToMySimulations(): void {
    this.router.navigate(['/dashboard/simulation/mes-simulations']);
  }
}
