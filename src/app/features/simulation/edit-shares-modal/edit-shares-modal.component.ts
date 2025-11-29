import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SimulationStateService } from '../../../services/simulationState.service';

@Component({
  selector: 'app-edit-shares-modal',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './edit-shares-modal.component.html',
  styleUrl: './edit-shares-modal.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class EditSharesModalComponent {

  @Input() item: any;
  @Output() close = new EventEmitter<void>();
  @Output() saveShares = new EventEmitter<{ id: number; shares: number }>();

  shares: number = 1;
  constructor(private simulationState: SimulationStateService) {}

  ngOnChanges() {
    if (this.item) {
      this.shares = this.item.shares;
    }
  }

  increment() {
    this.shares++;
  }

  decrement() {
    if (this.shares > 1) this.shares--;
  }

save() {
  this.saveShares.emit({ 
    id: this.item.scpi.id,  
    shares: this.shares
  });
  this.close.emit();
}



}
