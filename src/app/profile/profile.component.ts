import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';

import { ProfileRequest, ProfileResponse } from '../core/model/profile.model';
import { ProfileService } from '../core/service/profile.service';

import { PanelModule } from 'primeng/panel';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PanelModule,
    DropdownModule,
    InputNumberModule,
    ButtonModule
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  profileForm!: FormGroup;

  statusOptions = [
    { label: 'Célibataire', value: 'CELIBATAIRE' },
    { label: 'Marié',       value: 'MARIE' },
    { label: 'Pacsé',       value: 'PACSE' },
    { label: 'Divorcé',     value: 'DIVORCE' },
    { label: 'Veuf/Veuve',  value: 'VEUF' }
  ];

  constructor(
    private fb: FormBuilder,
    private profileService: ProfileService
  ) {}

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      status: ['', Validators.required],
      children: [0, [Validators.required, Validators.min(0)]],
      incomeInvestor: [null, [Validators.required, Validators.min(0)]],
      incomeConjoint: [null, [Validators.min(0)]]
    });
  }

  private getStatusValue(): string | null {
    const raw = this.profileForm.get('status')?.value;

    if (!raw) {
      return null;
    }

    if (typeof raw === 'object' && 'value' in raw) {
      return (raw as any).value;
    }

    return raw as string;
  }

  get showConjointIncome(): boolean {
    const status = this.getStatusValue();
    return status === 'MARIE' || status === 'PACSE';
  }

  onSubmit(): void {
    if (this.profileForm.valid) {
      const raw = this.profileForm.getRawValue();

      const status = this.getStatusValue();

      const payload: ProfileRequest = {
        ...raw,
        status: status
      } as ProfileRequest;

      console.log('Payload envoyé au backend :', payload);

      this.profileService.saveProfile(payload).subscribe({
        next: () => {
          alert(' Profil enregistré avec succès');
          this.profileForm.reset();
        },
        error: (err) => {
          console.error('Erreur lors de l’enregistrement', err);
          alert(' Erreur lors de l’enregistrement');
        }
      });
    } else {
      this.profileForm.markAllAsTouched();
    }
  }
}
