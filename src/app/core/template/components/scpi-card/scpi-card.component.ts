import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Scpi } from '../../../../models/scpi.model';
import { Router, RouterLink } from '@angular/router';


@Component({
  selector: 'app-scpi-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './scpi-card.component.html',
  styleUrl: './scpi-card.component.scss'
})
export class ScpiCardComponent {
  @Input() scpi!: Scpi;
  
  constructor(private router: Router) {}

  onViewMore(): void {
    console.log("--->", this.scpi);
    
  }

  onInvest(): void {
    this.router.navigate(['/dashboard/scpi', this.scpi.id, 'invest']);
  }
}