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
import { SaveSimulationModalComponent } from "../save-simulation-modal/save-simulation-modal.component";
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
    SectoralRepartitionComponent,
    SaveSimulationModalComponent
],
   providers: [MessageService],
  templateUrl: './simulation-layout.component.html',
  styleUrl: './simulation-layout.component.scss',
})
export class SimulationLayoutComponent implements OnInit {

 summary: SimulationSummary = {
    id: null,
    name: '',
    totalInvestment: 0,
    grossRevenue: 0,
    netRevenue: 0,
    totalScpis: 0,
    taxRate: 0
  };


  tmiValue = 0;
  countries: any[] = [];
  showAddModal = false;

  taxableIncome = 0;
  incomeTax = 0;
  socialTax = 0;
  repartition: { sectoral: { label: string, percentage: number }[] } | null = null;
  fiscality: FiscalityResponse | null = null;
  hasUnsavedChanges$!: Observable<boolean>;
  showSaveModal = false;
  hasUnsavedChanges = false;


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
  this.simulationState.dirty$.subscribe(dirty => {
  this.hasUnsavedChanges = dirty;
});
  }
  get canExport(): boolean {
    return !!this.summary.id && !this.hasUnsavedChanges;
  }

  onOpenAddModal(open: boolean) {
    this.showAddModal = open;
  }

  onAddScpi(event: { scpi: ScpiSimulator; shares: number }) {
    this.simulationState.addOrUpdateScpi(event.scpi, event.shares);
    this.showAddModal = false;
  }

  saveSimulationWithName(nameFromModal: string | null): void {
    const portfolio = this.simulationState.getPortfolioSnapshot();
    const summary = this.simulationState.getSummarySnapshot();
    
    if (!portfolio?.length) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Action impossible',
        detail: 'Veuillez ajouter au moins une SCPI avant de sauvegarder.'
      });
      return;
    }

    const finalName = (nameFromModal ?? summary.name)?.trim();

    if (!summary.id && !finalName) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Nom manquant',
        detail: 'Veuillez saisir un nom pour la simulation.'
      });
      return;
    }

    const payload = {
      id: summary.id,
      name: finalName,
      taxRate: summary.taxRate,
      items: portfolio.map(p => ({
        scpiId: p.scpi.id,
        shares: p.shares
      }))
    };

    this.scpiService.saveSimulation(payload).subscribe({
      next: res => {

        if (!summary.id) {
          this.simulationState.setSimulationId(res.id);
        }

        if (finalName && finalName !== summary.name) {
          this.simulationState.setSimulationName(finalName);
        }

        this.simulationState.markAsSaved();
        localStorage.setItem('currentSimulationId', res.id!.toString());

        this.closeSaveModal();

        this.messageService.add({
          severity: 'success',
          summary: 'Simulation sauvegardée',
          detail: 'Votre simulation a été enregistrée avec succès.',
          life: 2500
        });

        setTimeout(() => {
          this.router.navigate(['/dashboard/simulation/mes-simulations']);
        }, 800);
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
openSaveModal(): void {
  this.showSaveModal = true;
}

closeSaveModal(): void {
  this.showSaveModal = false;
}

exportSimulation(): void {
  if (!this.summary.id) return;

  this.scpiService.exportSimulationPdf(this.summary.id).subscribe({
    next: blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `simulation-${this.summary.name || 'scpi'}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    },
    error: () => {
      this.messageService.add({
        severity: 'error',
        summary: 'Erreur',
        detail: 'Impossible d’exporter la simulation.'
      });
    }
  });
}


}
