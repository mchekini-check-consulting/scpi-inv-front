import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-scpi-simulator-home',
  standalone: true,
  imports: [],
  templateUrl: './scpi-simulator-home.component.html',
  styleUrl: './scpi-simulator-home.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class ScpiSimulatorHomeComponent {

  constructor(private router: Router) {
  
  }
  goToNewSimulation() {
    this.router.navigate(['/dashboard/simulation/nouvelle']);
  }
}
