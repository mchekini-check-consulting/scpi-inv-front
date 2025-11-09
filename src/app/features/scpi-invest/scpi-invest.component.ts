import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ScpiService } from '../../services/scpi.service';
import { ScpiInvestment } from '../../models/scpi-investment.model';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-scpi-invest',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputNumberModule, DialogModule, ButtonModule],
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
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
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
          this.updateAmount();
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Erreur chargement SCPI:', err);
        },
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

  updateAmount(): void {
    const parts = this.form.get('shareCount')?.value || 0;
    const prix = this.scpiInvestment?.sharePrice || 0;
    this.currentInvestmentAmount = parts * prix;

    this.form
      .get('amount')
      ?.setValue(this.currentInvestmentAmount, { emitEvent: false });

    if (!this.scpiInvestment) {
      this.isAmountValid = false;
      this.cdr.detectChanges();
      return;
    }

    const totalApresInvestissement =
      this.totalInvestedAmount + this.currentInvestmentAmount;
    const minimumRequis = this.scpiInvestment.minimumSubscription;

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
