import {Component, OnInit} from '@angular/core';
import {TableModule} from "primeng/table";
import {RequestHistory} from "../../models/request-history.model";
import {RequestHistoryService} from "../../services/request-history.service";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-request-history',
  standalone: true,
  imports: [
    TableModule, CommonModule
  ],
  templateUrl: './request-history.component.html',
  styleUrls: ['./request-history.component.scss'],
})
export class RequestHistoryComponent implements OnInit {
  requests: RequestHistory[] = [];

  constructor(private requestHistoryService: RequestHistoryService) {}

  ngOnInit(): void {
    this.requestHistoryService.getRequestHistory().subscribe((data: RequestHistory[]) => {
      this.requests = data;
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

  filterByStatus() {

  }
}
