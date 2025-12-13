import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { ScpiService } from '../../core/service/scpi.service';

import { ScpiCardComponent } from '../../core/template/components/scpi-card/scpi-card.component';
import { Scpi } from '../../core/model/scpi.model';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-scpi-catalog',
  standalone: true,
  imports: [CommonModule, ScpiCardComponent, PaginatorModule],
  templateUrl: './scpi-catalog.component.html',
  styleUrl: './scpi-catalog.component.scss',
})
export class ScpiCatalogComponent implements OnInit {
  scpis: Scpi[] = [];
  isLoading = false;
  error: string | null = null;

  private destroy$ = new Subject<void>();

  first = 0;
  rows = 20;
  totalRecords = 0;
  rowsPerPageOptions = [10, 20, 30];

  constructor(private scpiService: ScpiService) {}

  ngOnInit(): void {
    this.loadScpis();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadScpis(): void {
    this.isLoading = true;
    this.error = null;

    const currentPage = Math.floor(this.first / this.rows);

    this.scpiService.getScpiPage(currentPage, this.rows).subscribe({
      next: (response) => {
        this.scpis = response.data;
        this.totalRecords = response.total;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des SCPI';
        this.isLoading = false;
        console.error('Erreur:', err);
      },
    });
  }

  onPageChange(event: PaginatorState): void {
    this.first = event.first ?? 0;
    this.rows = event.rows ?? 20;
    this.loadScpis();
  }

  handleViewMore(scpi: Scpi): void {
    console.log('Voir plus:', scpi);
  }

  handleInvest(scpi: Scpi): void {
    console.log('Investir dans:', scpi);
  }
}
