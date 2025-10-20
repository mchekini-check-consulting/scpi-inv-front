// src/app/features/dashboard/scpi/scpi.component.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScpiCardComponent } from '../../../shared/components/molecules/scpi-card/scpi-card.component';
import { Scpi } from '../../../shared/models/scpi.model';
import { ScpiService } from '../../../core/services/scpi.service';

@Component({
  selector: 'app-scpi',
  standalone: true,
  imports: [CommonModule, ScpiCardComponent],
  templateUrl: './scpi.component.html',
  styleUrl: './scpi.component.scss',
})
export class ScpiComponent {
  scpis: Scpi[] = [];
  loading: boolean = true;
  currentPage: number = 0;
  pageSize: number = 12;
  totalItems: number = 0;

  constructor(private scpiService: ScpiService) {}

  ngOnInit(): void {
    this.loadScpis();
  }

  loadScpis(): void {
    this.loading = true;

    this.scpiService.getScpiPage(this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        this.scpis = response.data;
        this.totalItems = response.total;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des SCPI:', error);
        this.loading = false;
      },
    });
  }

  onInvest(scpi: Scpi): void {
    console.log(scpi)
  }


  onAddToWatchlist(scpi: Scpi): void {
 
   console.log(scpi);
   
  }
}
