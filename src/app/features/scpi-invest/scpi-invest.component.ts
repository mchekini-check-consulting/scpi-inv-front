import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ScpiService } from '../../services/scpi.service';
import { ScpiInvestment } from '../../models/scpi-investment.model';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';

@Component({
  selector: 'app-scpi-invest',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputNumberModule],
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
    if (!this.selectedDuration || !this.scpiInvestment?.scpiDismembrement) return null;
    return this.scpiInvestment.scpiDismembrement.find(
      (d) => d.durationYears === this.selectedDuration
    );
  }

  onSubmit(): void {
  }
}