import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TableModule} from 'primeng/table';
import {DropdownModule} from 'primeng/dropdown';
import {ButtonModule} from 'primeng/button';
import {FormsModule} from '@angular/forms';
import {TagModule} from 'primeng/tag';
import {ToolbarModule} from 'primeng/toolbar';
import {MessageModule} from 'primeng/message';
import {HistoryService} from "../../core/service/history.service";
import {History} from '../../core/model/history.model';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    DropdownModule,
    ButtonModule,
    FormsModule,
    TagModule,
    ToolbarModule,
    MessageModule
  ],
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
})
export class HistoryComponent implements OnInit {
  histories: History[] = [];
  historyDetails: History[] = [];
  filteredHistories: History[] = [];
  selectedStatus: string = 'ALL';
  expandedRowKeys: { [key: string]: boolean } = {};
  error!: string;

  statusOptions = [
    {label: 'Tous les statuts', value: 'ALL'},
    {label: 'Validée', value: 'SUCCESS'},
    {label: 'Rejetée', value: 'FAILED'},
    {label: 'En cours', value: 'PENDING'},
  ];

  constructor(private historyService: HistoryService) {
  }

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
      case 'SUCCESS':
        return 'Validée';
      case 'FAILED':
        return 'Rejetée';
      case 'PENDING':
        return 'En cours';
      default:
        return status;
    }
  }

  getStatusSeverity(status: string): 'success' | 'danger' | 'warn' | 'info' {
    switch (status) {
      case 'SUCCESS':
        return 'success';
      case 'FAILED':
        return 'danger';
      default:
        return 'info';
    }
  }

  getStatusStyle(status: string): any {
    switch (status) {
      case 'PENDING':
        return {
          'background-color': '#ffd54f',
          'color': '#000000',
          'border-color': '#ffc107'
        };
      default:
        return {};
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'SUCCESS':
        return 'pi pi-check';
      case 'FAILED':
        return 'pi pi-times';
      case 'PENDING':
        return 'pi pi-clock';
      default:
        return 'pi pi-info-circle';
    }
  }

  filterByStatus(): void {
    if (this.selectedStatus === 'ALL') {
      this.filteredHistories = this.histories;
    } else {
      this.filteredHistories = this.histories.filter(h => h.status === this.selectedStatus);
    }
  }

  loadDetails(history: History): void {
    this.historyService.getHistoryDetailsByInvestmentId(history.investmentId).subscribe({
      next: (details) => {
        this.historyDetails = details;
      },
      error: (err) => {
        console.error('Erreur chargement détails:', err);
      },
    });
  }

  onRowExpand(event: any): void {
    const history = event.data;
    this.expandedRowKeys = { [history.investmentId]: true };


    this.loadDetails(history);
  }

  onRowCollapse(event: any): void {
    delete this.expandedRowKeys[event.data.investmentId];
  }
}
