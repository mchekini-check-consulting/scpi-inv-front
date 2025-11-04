import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import {HistoryService} from "../../services/history.service";
import { History } from '../../models/history.model';
import { FormsModule } from '@angular/forms';
import {TagModule} from "primeng/tag";
import {ToolbarModule} from "primeng/toolbar";


@Component({
  selector: 'app-request-history',
  standalone: true,
  imports: [CommonModule, TableModule, DropdownModule, ButtonModule, FormsModule, TagModule, ToolbarModule],
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
})
export class HistoryComponent implements OnInit {
  histories: History[] = [];
  filteredHistories: History[] = [];
  selectedStatus: string = 'ALL';
  error!: string;

  statusOptions = [
    { label: 'Tous les statuts', value: 'ALL' },
    { label: 'Validée', value: 'SUCCESS' },
    { label: 'Rejetée', value: 'FAILED' },
    { label: 'En cours', value: 'PENDING' },
  ];

  constructor(private historyService: HistoryService) {}

  ngOnInit(): void {
    this.historyService.getHistory().subscribe({
      next: (response) => {
        this.histories = response;
        this.filteredHistories = response;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement de l\'historique';
        console.error('Erreur:', err);
      },
    });
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'SUCCESS': return 'Validée';
      case 'FAILED': return 'Rejetée';
      case 'PENDING': return 'En cours';
      default: return status;
    }
  }

  filterByStatus(): void {
    if (this.selectedStatus === 'ALL') {
      this.filteredHistories = this.histories;
    } else {
      this.filteredHistories = this.histories.filter(h => h.status === this.selectedStatus);
    }
  }

  getStatusSeverity(status: string): 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast' | undefined {
    switch (status) {
      case 'SUCCESS': return 'success';
      case 'FAILED': return 'danger';
      case 'PENDING': return 'warn';
      default: return 'info';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'SUCCESS': return 'pi pi-check';
      case 'FAILED': return 'pi pi-times';
      case 'PENDING': return 'pi pi-clock';
      default: return 'pi pi-info-circle';
    }
  }
}
