import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Scpi, ScpiDetail } from "../../../../models/scpi.model";
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
  @Input() ScpiDetail !: ScpiDetail;
  @Output() viewMore = new EventEmitter<void>();
  @Output() invest = new EventEmitter<void>();

  constructor(private router: Router){}
onViewMore(): void {
  const slug = `${this.scpi.name}-${this.scpi.manager}`;
  this.router.navigate([`/dashboard/scpi/${slug}`]);
}


  onInvest(): void {
    this.router.navigate(['/dashboard/scpi', this.scpi.id, 'invest']);
  }
}
