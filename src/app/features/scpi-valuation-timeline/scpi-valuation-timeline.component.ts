import {Component, Input, ViewEncapsulation} from '@angular/core';
import {CommonModule, CurrencyPipe} from "@angular/common";
import {Timeline} from "primeng/timeline";
import {TooltipModule} from "primeng/tooltip";

@Component({
  selector: 'app-scpi-valuation-timeline',
  standalone: true,
  imports: [
    CurrencyPipe,
    TooltipModule,
    CommonModule,
    Timeline
  ],
  templateUrl: './scpi-valuation-timeline.component.html',
  styleUrl: './scpi-valuation-timeline.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class ScpiValuationTimelineComponent {
  @Input() sharePriceHistory: { year: number; value: number }[] = [];
  @Input() reconstitutionHistory: { year: number; value: number }[] = [];
}

