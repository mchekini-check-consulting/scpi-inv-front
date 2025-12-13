import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToastModule } from 'primeng/toast';
import { ChartModule } from 'primeng/chart';
import { InputSwitchModule } from 'primeng/inputswitch';
import { MessageService } from 'primeng/api';
import { ScpiSummary } from '../../models/scheduled-payment.model';
import { InvestmentService } from '../../services/investment.service';
import { ScpiService } from '../../services/scpi.service';
import { InvestmentRequestDTO } from '../../models/investment.model';
import { DistributionRate } from '../../models/distribution-rate.model';

@Component({
  selector: 'app-scheduled-payment',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    DropdownModule,
    CalendarModule,
    ButtonModule,
    InputNumberModule,
    ToastModule,
    ChartModule,
    InputSwitchModule
  ],
  providers: [MessageService],
  templateUrl: './scheduled-payment.component.html',
  styleUrls: ['./scheduled-payment.component.scss']
})
export class ScheduledPaymentComponent implements OnInit {

  form!: FormGroup;

  scpis: ScpiSummary[] = [];
  selectedScpi: ScpiSummary | null = null;
  hasAlreadyInvested: boolean | null = null;

  loadingScpis = false;
  checkingInvestStatus = false;
  submitting = false;

  showValidationErrors = false;

  projectionYears: number = 10;
  selectedScenario: 'realistic' | 'optimistic' | 'pessimistic' | 'custom' = 'realistic';
  customRate: number = 1.3;
  autoReinvest: boolean = false;

  finalCapital: number = 0;
  finalMonthlyRent: number = 0;

  chartData: any = {};
  chartOptions: any = {};

  scenarios = {
    realistic: 1.3,
    optimistic: 2.0,
    pessimistic: -0.5,
  };

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private investmentService: InvestmentService,
    private scpiService: ScpiService
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.loadScpis();
    this.initChartOptions();
  }

  private buildForm(): void {
    this.form = this.fb.group({
      scpiId: [null, Validators.required],
      firstShares: [1],
      monthlyShares: [1, [Validators.required, Validators.min(1)]],
      firstDebitDate: [null, Validators.required]
    });
  }

  private loadScpis(): void {
    this.loadingScpis = true;
    this.scpiService.getScpiScheduledPayment().subscribe({
      next: (data) => {
        this.scpis = data;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Impossible de charger les SCPI éligibles.'
        });
      },
      complete: () => (this.loadingScpis = false)
    });
  }

  onScpiChange(scpiId: number): void {
    this.selectedScpi = this.scpis.find(scpi => scpi.id === scpiId) || null;

    if (!this.selectedScpi) return;

    this.form.patchValue({
      firstShares: 1,
      monthlyShares: 1
    });

    this.hasAlreadyInvested = null;
    this.checkInvestStatus(scpiId);
  }

  private checkInvestStatus(scpiId: number): void {
    this.checkingInvestStatus = true;

    this.investmentService.hasInvested(scpiId).subscribe({
      next: (hasInvested) => {
        this.hasAlreadyInvested = hasInvested;
        this.updateFirstSharesValidators(hasInvested);
     
        if (this.selectedScpi) {
          this.calculateProjection();
        }
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Impossible de vérifier votre historique.'
        });
      },
      complete: () => (this.checkingInvestStatus = false)
    });
  }

  private updateFirstSharesValidators(hasInvested: boolean): void {
    const ctrl = this.form.get('firstShares');
    if (!ctrl) return;

    if (!hasInvested) {
      ctrl.setValidators([Validators.required, Validators.min(1)]);
    } else {
      ctrl.clearValidators();
    }

    ctrl.updateValueAndValidity();
  }

  get firstPaymentAmount(): number {
    if (!this.selectedScpi) return 0;
    const price = this.selectedScpi.sharePrice;
    const shares = this.form.get('firstShares')?.value || 0;
    return price * shares;
  }

  get monthlyAmount(): number {
    if (!this.selectedScpi) return 0;
    const price = this.selectedScpi.sharePrice;
    const shares = this.form.get('monthlyShares')?.value || 0;
    return price * shares;
  }

  max(a: number, b: number): number {
    return Math.max(a, b);
  }

  isDateDisabled(dateMeta: any): boolean {
    return dateMeta.day > 28;
  }

  private formatDate(date: any): string {
    if (!date) throw new Error("Date is required");
    const d = new Date(date);
    return d.toISOString().substring(0, 10); 
  }

  get isSubmitDisabled(): boolean {
    if (!this.form.valid) return true;
    if (!this.selectedScpi) return true;
    if (this.monthlyAmount <= 0) return true;

    if (this.hasAlreadyInvested === false && this.firstPaymentAmount <= 0) {
      return true;
    }

    return false;
  }

  decreaseFirstShares(): void {
    if (!this.selectedScpi) return;

    const current = this.form.get('firstShares')?.value || 0;
    this.form.patchValue({ firstShares: current - 1 });
  }

  increaseFirstShares(): void {
    const current = this.form.get('firstShares')?.value || 0;
    this.form.patchValue({ firstShares: current + 1 });
  }

  onSubmit(): void {
    this.showValidationErrors = true;
    this.form.markAllAsTouched();

    if (this.isSubmitDisabled) {
      this.messageService.add({
        severity: 'error',
        summary: 'Formulaire incomplet',
        detail: 'Veuillez corriger les champs.'
      });
      return;
    }

    const fv = this.form.value;

    const payload: InvestmentRequestDTO = {
      scpiId: fv.scpiId,
      investmentAmount: this.hasAlreadyInvested === false ? this.firstPaymentAmount : 0,
      monthlyAmount: this.monthlyAmount,
      numberOfShares: fv.monthlyShares,
      paymentType: "SCHEDULED",
      scheduledPaymentDate: this.formatDate(fv.firstDebitDate),
      investmentType: "FULL_OWNERSHIP",
      dismembermentYears: null,
    };


    this.submitting = true;

    this.investmentService.createInvestment(payload).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Succès',
          detail: 'Versement programmé configuré avec succès.'
        });
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Erreur lors de la configuration.'
        });
      },
      complete: () => (this.submitting = false)
    });
  }



  get currentRate(): number {
    return this.selectedScenario === 'custom' 
      ? this.customRate 
      : this.scenarios[this.selectedScenario];
  }

  initChartOptions(): void {
    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: {
            usePointStyle: true,
            padding: 15,
            font: {
              size: 12,
              family: 'Inter, system-ui, sans-serif'
            }
          }
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          padding: 12,
          cornerRadius: 8,
          titleFont: {
            size: 14,
            weight: 'bold'
          },
          bodyFont: {
            size: 13
          },
          callbacks: {
            label: (context: any) => {
              const label = context.dataset.label || '';
              const value = context.parsed.y;
              return `${label}: ${value.toLocaleString('fr-FR')} €`;
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: (value: any) => {
              if (value >= 1000) {
                return (value / 1000) + 'k';
              }
              return value + ' €';
            },
            font: {
              size: 11
            }
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.05)'
          }
        },
        x: {
          grid: {
            display: false
          },
          ticks: {
            font: {
              size: 11
            }
          }
        }
      }
    };
  }

  selectPeriod(years: number): void {
    this.projectionYears = years;
    this.calculateProjection();
  }

  selectScenario(scenario: 'realistic' | 'optimistic' | 'pessimistic'): void {
    this.selectedScenario = scenario;
    this.calculateProjection();
  }

  onCustomRateChange(): void {
    this.selectedScenario = 'custom';
    this.calculateProjection();
  }

  calculateProjection(): void {
    if (!this.selectedScpi) return;

    const annualYield = this.selectedScpi.distributionRate;
   
    
    const annualRevalo = this.currentRate;

 
    const monthlyYield = annualYield / 100 / 12;
    const monthlyRevalo = annualRevalo / 100 / 12;


    const initialInvestment = this.hasAlreadyInvested === false 
      ? this.firstPaymentAmount 
      : 0;
    const monthlyInvestment = this.monthlyAmount;


    let capital = initialInvestment;
    let totalInvested = initialInvestment;

    const totalMonths = this.projectionYears * 12;
    const yearlyData: any[] = [];


    for (let month = 1; month <= totalMonths; month++) {
   
      capital += monthlyInvestment;
      totalInvested += monthlyInvestment;


      capital = capital * (1 + monthlyRevalo);


      const monthlyRent = capital * monthlyYield;

 
      if (this.autoReinvest) {
        capital += monthlyRent;
      }

  
      if (month % 12 === 0) {
        const year = month / 12;
        yearlyData.push({
          year: `Y${year}`,
          capital: Math.round(capital),
          totalInvested: Math.round(totalInvested),
          rent: Math.round(monthlyRent)
        });
      }
    }


    const lastData = yearlyData[yearlyData.length - 1];
    this.finalCapital = lastData.capital;
    this.finalMonthlyRent = lastData.rent;


    this.chartData = {
      labels: yearlyData.map(d => d.year),
      datasets: [
        {
          type: 'bar',
          label: 'Capital investi',
          data: yearlyData.map(d => d.totalInvested),
          backgroundColor: 'rgba(134, 188, 183, 0.6)',
          borderColor: 'rgba(134, 188, 183, 1)',
          borderWidth: 1,
          borderRadius: 8
        },
        {
          type: 'line',
          label: 'Patrimoine total',
          data: yearlyData.map(d => d.capital),
          borderColor: 'rgba(255, 159, 64, 1)',
          backgroundColor: 'rgba(255, 159, 64, 0.1)',
          borderWidth: 3,
          tension: 0.4,
          pointRadius: 5,
          pointHoverRadius: 7,
          pointBackgroundColor: 'rgba(255, 159, 64, 1)',
          pointBorderColor: '#fff',
          pointBorderWidth: 2
        }
      ]
    };
  }
}