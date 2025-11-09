import {Component, Input, OnChanges, SimpleChanges, ViewEncapsulation} from "@angular/core";
import {CommonModule, CurrencyPipe} from "@angular/common";
import {TooltipModule} from "primeng/tooltip";
import {TimelineModule} from "primeng/timeline";
import {ScpiDetail} from "../../models/scpi.model";
import {FormatFieldPipe} from "../../core/pipe/format-field.pipe";


interface TimelinePoint {
  year: number;
  value: number;
}

@Component({
  selector: 'app-scpi-valuation-timeline',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, TooltipModule, TimelineModule, FormatFieldPipe],
  templateUrl: './scpi-valuation-timeline.component.html',
  styleUrls: ['./scpi-valuation-timeline.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ScpiValuationTimelineComponent implements OnChanges {
  @Input() scpi!: ScpiDetail;

  sharePriceHistory: TimelinePoint[] = [];
  reconstitutionHistory: TimelinePoint[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['scpi'] && this.scpi?.scpiPartValues) {
      this.mapPartValues();
    }
  }

  private mapPartValues(): void {
    const sorted = [...this.scpi.scpiPartValues].sort(
      (a, b) => a.valuationYear - b.valuationYear
    );

    this.sharePriceHistory = sorted.map(v => ({
      year: v.valuationYear,
      value: v.sharePrice,
    }));

    this.reconstitutionHistory = sorted.map(v => ({
      year: v.valuationYear,
      value: v.reconstitutionValue,
    }));
  }
}


