import { Component, OnInit,ChangeDetectorRef, } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ScpiSelectionModalComponent } from '../scpi-selection-modal/scpi-selection-modal.component';
import { PortfolioManagementComponent } from '../portfolio-management/portfolio-management.component';
import { FormatFieldPipe } from '../../../core/pipe/format-field.pipe';
import { FiscalityResponse, PortfolioItem, ScpiSimulator, SimulationSummary } from '../../../core/model/scpi-simulator.model';
import { SimulationStateService } from '../../../core/service/simulationState.service';
import { ScpiService } from '../../../core/service/scpi.service';
import { GeoRepartitionComponent } from '../../../core/template/components/geo-repartition/geo-repartition.component';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { SectoralRepartitionComponent } from "../../../core/template/components/sectoral-repartition/sectoral-repartition.component";
import { Observable } from 'rxjs';
@Component({
  selector: 'app-simulation-layout',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ScpiSelectionModalComponent,
    PortfolioManagementComponent,
    FormatFieldPipe,
    GeoRepartitionComponent,
    ToastModule,
    SectoralRepartitionComponent],
   providers: [MessageService],
  templateUrl: './simulation-layout.component.html',
  styleUrl: './simulation-layout.component.scss',
})
export class SimulationLayoutComponent implements OnInit {

  summary!: SimulationSummary;

  tmiValue = 0;
  simulationName = '';

  countries: any[] = [];
  showAddModal = false;

  taxableIncome = 0;
  incomeTax = 0;
  socialTax = 0;
  repartition: { sectoral: { label: string, percentage: number }[] } | null = null;
  fiscality: FiscalityResponse | null = null;
  private fiscalityInitialized = false;
  hasUnsavedChanges$!: Observable<boolean>;

  constructor(
    private router: Router,
    private simulationState: SimulationStateService,
    private scpiService: ScpiService,
    private cdr: ChangeDetectorRef,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.simulationState.countries$.subscribe(countries => {
      this.countries = countries;
      this.cdr.detectChanges();
    });

    this.simulationState.summary$.subscribe(summary => {
      this.summary = summary;
      this.simulationName = summary.name;

      if (summary?.taxRate != null) {
        this.tmiValue = summary.taxRate;
      }
    });

    const savedId = this.simulationState.getSummarySnapshot()?.id
                    ?? localStorage.getItem('currentSimulationId');

    if (savedId) {
      this.scpiService.getSimulationById(+savedId).subscribe(sim => {
        this.simulationState.setSimulationFromResponseDTO(sim);
      });
    } else {

      const savedPortfolio = localStorage.getItem('unsavedPortfolio');
      if (savedPortfolio) {
        try {
          const portfolio: PortfolioItem[] = JSON.parse(savedPortfolio);
          this.simulationState.loadUnsavedPortfolio(portfolio);
        } catch {
          console.warn('Le portefeuille local est corrompu ou vide, réinitialisation.');
          this.simulationState.resetSimulationState();
        }
      }
    }

    this.simulationState.sectors$.subscribe(sectors => {
      this.repartition = { sectoral: [...sectors] };
      this.cdr.detectChanges();
    });

    this.simulationState.fiscality$.subscribe(fiscality => {
      const portfolio = this.simulationState.getPortfolioSnapshot();

      if (!portfolio || portfolio.length === 0) {
        this.fiscality = null;
        this.taxableIncome = 0;
        this.incomeTax = 0;
        this.socialTax = 0;
        if (this.summary) this.summary.netRevenue = 0;
        this.cdr.detectChanges();
        return;
      }

      if (fiscality) {
        this.fiscality = fiscality;
        this.taxableIncome = fiscality.revenuScpiNet;
        this.incomeTax = fiscality.impotTotal;
        this.socialTax = fiscality.prelevementsSociaux;
        this.tmiValue = fiscality.newTmi;
        this.summary.netRevenue = fiscality.revenuNetApresFiscalite;
        this.cdr.detectChanges();
      }
    });

  this.hasUnsavedChanges$ = this.simulationState.dirty$;

  }

  onNameChange() {
    this.simulationState.setSimulationName(this.simulationName);
  }

  onOpenAddModal(open: boolean) {
    this.showAddModal = open;
  }

  onAddScpi(event: { scpi: ScpiSimulator; shares: number }) {
    this.simulationState.addOrUpdateScpi(event.scpi, event.shares);
    this.showAddModal = false;
  }


  saveSimulation() {
    const portfolio = this.simulationState.getPortfolioSnapshot();
    const summary = this.simulationState.getSummarySnapshot();

    if (!portfolio || portfolio.length === 0) {
      this.messageService.add({
            severity: 'warn',
            summary: 'Action impossible',
            detail: 'Veuillez ajouter au moins une SCPI avant de sauvegarder.'
          });
          return;
    }

    const payload = {
      id: summary.id,
      name: summary.name,
      taxRate: summary.taxRate,
      items: portfolio.map(p => ({
        scpiId: p.scpi.id,
        shares: p.shares
      }))
    };

    this.scpiService.saveSimulation(payload).subscribe({
      next: res => {
        this.messageService.add({
            severity: 'success',
            summary: 'Simulation sauvegardée',
            detail: 'Votre simulation a été enregistrée avec succès.',
            life: 2500
          });
        if (!summary.id) {
          this.simulationState.setSimulationId(res.id);
        }
           this.simulationState.markAsSaved();
            this.cdr.detectChanges();

            localStorage.setItem('currentSimulationId', res.id!.toString());
        setTimeout(() => {
          this.router.navigate(['/dashboard/simulation/mes-simulations']);
        }, 1000);
      },
      error: err => {
        console.error(err);
        this.messageService.add({
              severity: 'error',
              summary: 'Erreur',
              detail: 'Une erreur est survenue lors de la sauvegarde.'
            });
          }
    });
}

  goBack() {
    this.router.navigate(['/dashboard/simulation']);
  }

}
