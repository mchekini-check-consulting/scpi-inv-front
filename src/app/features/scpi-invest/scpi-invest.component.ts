import { Component, OnInit } from '@angular/core';
import { ScpiService } from '../../services/scpi.service';
import { ScpiInvestment } from '../../models/scpi-investment.model';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-scpi-invest',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule], 
  templateUrl: './scpi-invest.component.html',
  styleUrl: './scpi-invest.component.scss',
})
export class ScpiInvestComponent implements OnInit {
  scpiInvestment?: ScpiInvestment;
  form: FormGroup;
  selectedDuration: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private scpiService: ScpiService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      investmentType: ['pleine'],
      amount: [10000],
      duration: [null],
    });
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.scpiService.getScpiInvestment(id).subscribe({
        next: (response: ScpiInvestment) => {
          this.scpiInvestment = response;

          const minAmount = response.minimumSubscription || 1000;
          this.form.patchValue({ amount: minAmount });
        },
        error: (err) => {
          console.error('❌ Erreur chargement investissement SCPI:', err);
        },
      });
    }

    this.form.get('investmentType')?.valueChanges.subscribe((val) => {

      if (val === 'pleine') {
        this.selectedDuration = null;
        this.form.patchValue({ duration: null });
      }
    });
  }

  get selectedInvestmentType(): string {
    return this.form.get('investmentType')?.value;
  }

  selectDuration(duration: number): void {
    this.selectedDuration = duration;
    this.form.patchValue({ duration });
  }

  getSelectedDismemberment() {
    if (!this.selectedDuration || !this.scpiInvestment?.scpiDismembrement) {
      return null;
    }

    return this.scpiInvestment.scpiDismembrement.find(
      (d) => d.durationYears === this.selectedDuration
    );
  }


  onSubmit(): void {
    console.log('Form:', this.form.value);
  }
}
