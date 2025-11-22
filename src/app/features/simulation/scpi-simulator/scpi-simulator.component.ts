import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-scpi-simulator',
  standalone: true,
  imports: [],
  templateUrl: './scpi-simulator.component.html',
  styleUrl: './scpi-simulator.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class ScpiSimulatorComponent {

constructor(private router: Router) {

}

goToNewSimulation() {
    this.router.navigate(['/dashboard/simulation/nouvelle']);
    console.log('navigation vers nouvelle simulation');
  }
}
