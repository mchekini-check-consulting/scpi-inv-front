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
import { ScpiSummary } from '../../core/model/scheduled-payment.model';
import { InvestmentService } from '../../core/service/investment.service';
import { ScpiService } from '../../core/service/scpi.service';
import { InvestmentRequestDTO } from '../../core/model/investment.model';


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
  hasAlreadyInvested: boolean = false;


  loadingScpis = false;
  checkingInvestStatus = false;
  submitting = false;

  showValidationErrors = false;

  minSharesError: boolean = false;

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

     this.initChartOptions();
  this.form.valueChanges.subscribe(() => {
    if (this.selectedScpi) {
      this.calculateProjection();
    }
  });

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

  const minShares = Math.max(
    1,
    Math.ceil(
      (this.selectedScpi.minimumSubscription ?? 1) /
      this.selectedScpi.sharePrice
    )
  );

  this.form.patchValue({
    firstShares: minShares,
    monthlyShares: 1
  });

  this.minSharesError = false;
  this.hasAlreadyInvested = false;
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
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
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

  const ctrl = this.form.get('firstShares');
  if (!ctrl) return;

  const current = ctrl.value || 0;
  const minShares = Math.max(
    1,
    Math.ceil(
      (this.selectedScpi.minimumSubscription ?? 1) /
      this.selectedScpi.sharePrice
    )
  );

  if (current - 1 < minShares) {
    this.minSharesError = true;
    return;
  }

  this.minSharesError = false;
  ctrl.patchValue(current - 1);
}



increaseFirstShares(): void {
  const ctrl = this.form.get('firstShares');
  if (!ctrl) return;

  this.minSharesError = false;
  ctrl.patchValue((ctrl.value || 0) + 1);
}

decreaseMonthlyShares(): void {
  const ctrl = this.form.get('monthlyShares');
  if (!ctrl) return;

  const value = ctrl.value || 1;
  ctrl.patchValue(Math.max(1, value - 1));
}

increaseMonthlyShares(): void {
  const ctrl = this.form.get('monthlyShares');
  if (!ctrl) return;

  ctrl.patchValue((ctrl.value || 1) + 1);
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
      numberOfShares: this.hasAlreadyInvested === false ? fv.firstShares : 0,
      paymentType: "SCHEDULED",
      scheduledPaymentDate: this.formatDate(fv.firstDebitDate),
      investmentType: "FULL_OWNERSHIP",
      dismembermentYears: null,
      numberOfSharesMonth: fv.monthlyShares
    };

console.log(payload)
  console.log("dans submit", this.hasAlreadyInvested);
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
