import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ScpiSummary } from '../../models/scheduled-payment.model';
import { InvestmentService } from '../../services/investment.service';
import { ScpiService } from '../../services/scpi.service';
import { InvestmentRequestDTO } from '../../models/investment.model';

@Component({
  selector: 'app-scheduled-payment',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DropdownModule,
    CalendarModule,
    ButtonModule,
    InputNumberModule,
    ToastModule
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

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private investmentService:InvestmentService,
    private scpiService:ScpiService
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.loadScpis();
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
  return d.toISOString().substring(0, 10); // "YYYY-MM-DD"
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
      paymentType:"SCHEDULED",
      scheduledPaymentDate: this.formatDate(fv.firstDebitDate),
     investmentType: "FULL_OWNERSHIP",

  dismembermentYears: null,

    };

    console.log("firstDebitDate FV =", fv.firstDebitDate);
console.log("type =", typeof fv.firstDebitDate);
console.log(payload)

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
}
