import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [TableModule],
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.scss'
})
export class DataTableComponent {

}
