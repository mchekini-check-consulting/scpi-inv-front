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

  // Validation
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

    this.form.get('amount')?.setValue(this.currentInvestmentAmount, { emitEvent: false });

    if (!this.scpiInvestment) {
      this.isAmountValid = false;
      this.cdr.detectChanges();
      return;
    }

    const totalApresInvestissement = this.totalInvestedAmount + this.currentInvestmentAmount;
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
    if (!this.selectedDuration || !this.scpiInvestment?.scpiDismembrement) return null;
    return this.scpiInvestment.scpiDismembrement.find(
      (d) => d.durationYears === this.selectedDuration
    );
  }

  onSubmit(): void {
    
  }
}