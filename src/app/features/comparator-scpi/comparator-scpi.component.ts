import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { SliderModule } from 'primeng/slider';
import { SelectModule } from 'primeng/select';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ScpiService } from '../../core/service/scpi.service';
import { ScpiWithRates } from '../../core/model/scpi.model';
import localeFr from '@angular/common/locales/fr';
import { Location } from '@angular/common';
import {FormatFieldPipe} from "../../core/pipe/format-field.pipe";

registerLocaleData(localeFr);

@Component({
  standalone: true,
  selector: 'app-comparator-scpi',
  templateUrl: './comparator-scpi.component.html',
  styleUrls: ['./comparator-scpi.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormsModule,
    InputNumberModule,
    SliderModule,
    SelectModule,
    ProgressSpinnerModule,
    FormatFieldPipe,
  ],
  providers: [{ provide: 'LOCALE_ID', useValue: 'fr-FR' }],
})
export class ComparatorScpiComponent implements OnInit {
  investment = 10000;
  minInvestment = 1000;
  maxInvestment = 100000;
  step = 500;

  scpiOptions: ScpiWithRates[] = [];
  selectedScpis: (ScpiWithRates | null)[] = [null, null, null];
  selectedScpisEffective: ScpiWithRates[] = [];
  isLoading = true;

  private filteredOptionsCache: ScpiWithRates[][] = [[], [], []];

  constructor(
    private readonly scpiService: ScpiService,
    private cdr: ChangeDetectorRef,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.loadScpiOptions();
  }

  private loadScpiOptions(): void {
    this.isLoading = true;
    this.scpiService.getScpisForComparator().subscribe({
      next: (data: ScpiWithRates[]) => {
        this.scpiOptions = data || [];
        this.updateFilteredOptionsCache();
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Erreur chargement SCPI', err);
        this.isLoading = false;
        this.cdr.markForCheck();
      },
    });
  }

  onInvestmentChange(value: number | null | undefined): void {
    if (value == null || isNaN(value as any)) {
      this.investment = this.minInvestment;
    } else if (value < this.minInvestment) {
      this.investment = this.minInvestment;
    } else if (value > this.maxInvestment) {
      this.investment = this.maxInvestment;
    } else {
      this.investment = value;
    }
    this.cdr.markForCheck();
  }

  getFilteredOptions(index: number): ScpiWithRates[] {
    return this.filteredOptionsCache[index];
  }

  private updateFilteredOptionsCache(): void {
    for (let i = 0; i < 3; i++) {
      const selectedIds = this.selectedScpis
        .map((s, idx) => (idx !== i && s ? s.id : null))
        .filter((id) => id !== null) as number[];
      this.filteredOptionsCache[i] = this.scpiOptions.filter(
        (scpi) => !selectedIds.includes(scpi.id)
      );
    }
  }

  onScpiSelected(index: number, scpi: ScpiWithRates | null): void {
    this.selectedScpis[index] = scpi;
    this.updateEffectiveSelection();
    this.updateFilteredOptionsCache();
    this.cdr.markForCheck();
  }

  private updateEffectiveSelection(): void {
    const seen = new Set<number>();
    this.selectedScpisEffective = this.selectedScpis
      .filter((s): s is ScpiWithRates => !!s)
      .filter((s) => {
        if (seen.has(s.id)) return false;
        seen.add(s.id);
        return true;
      });
  }

  getLatestRate(scpi: ScpiWithRates): number {
    if (!scpi.distributionRates?.length) return 0;
    return scpi.distributionRates[0]?.rate || 0;
  }

  getMonthlyRevenue(scpi: ScpiWithRates | null): number {
    if (!scpi) return 0;
    return (this.investment * this.getLatestRate(scpi)) / 100 / 12;
  }

  formatEuro(value: number | null | undefined): string {
    if (value == null) return '-';
    return (
      ((value * this.investment) / 100).toLocaleString('fr-FR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }) + ' €'
    );
  }

  formatEuroNoCents(value: number | null | undefined): string {
    if (value == null) return '-';
    return value.toLocaleString('fr-FR', { maximumFractionDigits: 0 }) + ' €';
  }

  getEnjoymentDelayLabel(scpi: ScpiWithRates | null): string {
    if (!scpi) return '-';
    return `${scpi.enjoymentDelay} mois`;
  }

  trackByIndex(index: number): number {
    return index;
  }

  goBack(): void {
    this.location.back();
  }
  getSubscriptionFeeRate(scpi: ScpiWithRates): number {
    return scpi.subscriptionFees ?? 0;
  }

  getCashbackRate(scpi: ScpiWithRates): number {
    return scpi.cashback ?? 0;
  }
}
