import {Component} from '@angular/core';
import {FileUploadModule} from 'primeng/fileupload';
import {ButtonModule} from 'primeng/button';
import {CardModule} from 'primeng/card';
import {DialogModule} from 'primeng/dialog';
import {CommonModule} from '@angular/common';
import {TableModule} from "primeng/table";

@Component({
  selector: 'app-request-history',
  standalone: true,
  imports: [
    CommonModule,
    FileUploadModule,
    ButtonModule,
    CardModule,
    DialogModule,
    TableModule,
  ],
  templateUrl: './request-history.component.html',
  styleUrls: ['./request-history.component.scss'],
})
export class RequestHistoryComponent {
requests!: [];
}
