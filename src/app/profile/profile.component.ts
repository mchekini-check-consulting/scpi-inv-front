import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';

import {ProfileRequest} from '../core/model/profile.model';
import {ProfileService} from '../core/service/profile.service';

import {PanelModule} from 'primeng/panel';
import {DropdownModule} from 'primeng/dropdown';
import {InputNumberModule} from 'primeng/inputnumber';
import {ButtonModule} from 'primeng/button';
import {ToastModule} from "primeng/toast";
import {MessageService} from "primeng/api";

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PanelModule,
    DropdownModule,
    InputNumberModule,
    ButtonModule,
    ToastModule
  ],
  providers: [MessageService],
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
    private profileService: ProfileService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      status: [null, Validators.required],
      children: [0, [Validators.required, Validators.min(0)]],
      incomeInvestor: [0, [Validators.required, Validators.min(0)]],
      incomeConjoint: [0, [Validators.min(0)]]
    });

    this.loadProfile();
  }

  loadProfile(): void {
    this.profileService.getProfile().subscribe({
      next: (source) => {
        if (source) {
          this.profileForm.patchValue(source);
        }
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Impossible de charger votre profil'
        });
      }
    });
  }

  private getStatusValue(): string | null {
    const raw = this.profileForm?.get('status')?.value;

    if (!raw) {
      return null;
    }

    if (typeof raw === 'object' && 'value' in raw) {
      return raw.value;
    }

    return raw as string;
  }

  get showConjointIncome(): boolean {
    const status = this.getStatusValue();
    return status === 'MARIE' || status === 'PACSE';
  }

  onSubmit(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    const payload: ProfileRequest = {
      ...this.profileForm.getRawValue(),
      status: this.getStatusValue()
    };

    this.profileService.saveProfile(payload).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Succès',
          detail: 'Profil enregistré avec succès'
        });
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Une erreur est survenue lors de l’enregistrement'
        });
      }
    });
  }
}
