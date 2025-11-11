import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ScpiService } from '../../services/scpi.service';
import { ScpiInvestment } from '../../models/scpi-investment.model';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { InvestmentRequestDTO } from '../../models/investment.model';
import { ToastModule } from 'primeng/toast'
import { InvestmentService } from '../../services/investment.service';
@Component({
  selector: 'app-scpi-invest',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputNumberModule, DialogModule, ButtonModule,ToastModule],
  providers: [MessageService],
  templateUrl: './scpi-invest.component.html',
  styleUrl: './scpi-invest.component.scss',
})
export class ScpiInvestComponent implements OnInit {
  scpiInvestment?: ScpiInvestment;
  form: FormGroup;
  selectedDuration: number | null = null;

  isAmountValid = false;
  totalInvestedAmount = 0;
  currentInvestmentAmount = 0;

  showRecapModal = false;

  recapData: {
    numberOfShares: number;
    annualRevenue: number;
    monthlyRevenue: number;
  } | null = null;

  constructor(
    private route: ActivatedRoute,
    private scpiService: ScpiService,
    private investmentService:InvestmentService, 
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private messageService: MessageService
  ) {
    this.form = this.fb.group({
      investmentType: ['pleine'],
      amount: [0],
      duration: [null],
      shareCount: [1],
    });
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
  if (id) {
    this.scpiService.getScpiInvestment(id).subscribe({
      next: (response: ScpiInvestment) => {
        this.scpiInvestment = response;
        this.totalInvestedAmount = response.totalInvestedAmount || 0;

        const shareCountCtrl = this.form.get('shareCount');

        if (!response.hasInvested && response.minimumSubscription && response.sharePrice) {
          const minShares = Math.ceil(response.minimumSubscription / response.sharePrice);
          shareCountCtrl?.setValue(minShares, { emitEvent: false });
        } else if (response.hasInvested) {
          shareCountCtrl?.setValue(1, { emitEvent: false });
        }

        this.updateAmount();
        this.cdr.detectChanges();
      },
        error: (err) => {
          console.error('Erreur chargement SCPI:', err);
        }
      });
    }

    this.form.get('investmentType')?.valueChanges.subscribe((val) => {
      if (val === 'pleine') {
        this.selectedDuration = null;
        this.form.patchValue({ duration: null });
      }
    });

    this.form.get('shareCount')?.valueChanges.subscribe(() => {
      this.updateAmount();
    });
  }

  calculateMinShares(): number {
    if (
      !this.scpiInvestment ||
      !this.scpiInvestment.minimumSubscription ||
      !this.scpiInvestment.sharePrice ||
      this.scpiInvestment.sharePrice <= 0
    ) {
      return 1;
    }
    return Math.ceil(this.scpiInvestment.minimumSubscription / this.scpiInvestment.sharePrice);
  }

  updateAmount(): void {
    let parts = this.form.get('shareCount')?.value || 0;
    const prix = this.scpiInvestment?.sharePrice || 0;
    const minimumRequis = this.scpiInvestment?.minimumSubscription || 0;

    if (this.scpiInvestment && !this.scpiInvestment.hasInvested && prix > 0) {
      const minShares = this.calculateMinShares();
      if (parts < minShares) {
        parts = minShares;
        this.form.get('shareCount')?.setValue(minShares, { emitEvent: false });
      }
    }

    this.currentInvestmentAmount = parts * prix;
    this.form.get('amount')?.setValue(this.currentInvestmentAmount, { emitEvent: false });

    if (!this.scpiInvestment) {
      this.isAmountValid = false;
      this.cdr.detectChanges();
      return;
    }

    const totalApresInvestissement = this.totalInvestedAmount + this.currentInvestmentAmount;

    if (this.scpiInvestment.hasInvested) {
      this.isAmountValid = totalApresInvestissement >= minimumRequis;
    } else {
      this.isAmountValid = this.currentInvestmentAmount >= minimumRequis;
    }

    this.cdr.detectChanges();
  }

  get selectedInvestmentType(): string {
    return this.form.get('investmentType')?.value;
  }

  selectDuration(duration: number): void {
    this.selectedDuration = duration;
    this.form.patchValue({ duration });
  }

  getSelectedDismemberment() {
    if (!this.selectedDuration || !this.scpiInvestment?.scpiDismembrement)
      return null;
    return this.scpiInvestment.scpiDismembrement.find(
      (d) => d.durationYears === this.selectedDuration
    );
  }

  getInvestmentTypeEnum(): 'FULL_OWNERSHIP' | 'BARE_OWNERSHIP' | 'USUFRUCT' {
  const type = this.form.value.investmentType;
  switch (type) {
    case 'pleine':     return 'FULL_OWNERSHIP';
    case 'nue':        return 'BARE_OWNERSHIP';
    case 'usufruit':   return 'USUFRUCT';
    default:           return 'FULL_OWNERSHIP';
  }
}

  onSubmit(): void {
    if (!this.scpiInvestment) {
      return;
    }

    if (!this.isAmountValid) {
      return;
    }

    const formValue = this.form.value;
    const dismemberment = this.getSelectedDismemberment();

    const investmentType = formValue.investmentType || 'pleine';
    const numberOfShares = formValue.shareCount || 0;
    const amount = this.currentInvestmentAmount || 0;
    const distributionRate = this.scpiInvestment.distributionRate || 0;

    let annualRevenue = 0;

    if (investmentType === 'pleine') {
      annualRevenue = amount * (distributionRate / 100);
    } else if (investmentType === 'usufruit' && dismemberment) {
      const usufruitPrice = (amount * dismemberment.usufruitPercentage) / 100;
      annualRevenue =
        usufruitPrice * (this.scpiInvestment.distributionRate / 100);
    } else if (investmentType === 'nue' && dismemberment) {
      const nueProprietePrice =
        (amount * dismemberment.nueProprietePercentage) / 100;
      annualRevenue =
        nueProprietePrice * (this.scpiInvestment.distributionRate / 100);
    }

    this.recapData = {
      numberOfShares,
      annualRevenue,
      monthlyRevenue: annualRevenue / 12,
    };


    this.showRecapModal = true;
  }

  closeRecapModal(): void {
    this.showRecapModal = false;
  }
confirmInvestment(): void {
  if (!this.scpiInvestment || !this.recapData) return;

  const request: InvestmentRequestDTO = {
    scpiId: this.scpiInvestment.id,
    investmentType: this.getInvestmentTypeEnum(),
    numberOfShares: this.recapData.numberOfShares,
    investmentAmount: this.currentInvestmentAmount,
    dismembermentYears: this.selectedDuration || null
  };

  this.investmentService.createInvestment(request).subscribe({
    next: () => {
      this.showRecapModal = false;
      this.messageService.add({
        severity: 'success',
        summary: 'Demande envoyée',
        detail:'Votre demande d’investissement a été prise en compte et sera traitée dans les plus brefs délais'
      });
      setTimeout(() => {},2500); 
    },
    error: (err) => {
      this.messageService.add({
        severity: 'error',
        summary: 'Erreur',
        detail: 'Une erreur est survenue. Veuillez réessayer.'
      });
    }
  });
}

  getInvestmentTypeLabel(): string {
    const type = this.form.value.investmentType;
    const labels: Record<string, string> = {
      'pleine': 'Pleine propriété',
      'nue': 'Nue-propriété',
      'usufruit': 'Usufruit'
    };
    return labels[type] || type;
  }
}
