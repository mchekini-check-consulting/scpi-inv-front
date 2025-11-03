import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { ScpiService } from '../../services/scpi.service';
import { ScpiDetail } from '../../models/scpi.model';
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { FormatFieldPipe } from '../../core/pipe/format-field.pipe';

@Component({
  selector: 'app-scpi-detail',
  standalone: true,
  imports: [CommonModule, AccordionModule, ButtonModule, FormatFieldPipe],
  templateUrl: './scpi-detail.component.html',
  styleUrls: ['./scpi-detail.component.scss'],
})
export class ScpiDetailComponent implements OnInit {
  scpi?: ScpiDetail;
  isLoading = false;
  error?: string;

  constructor(
    private route: ActivatedRoute,
    private scpiService: ScpiService,
    private router: Router,
    private titleService: Title
  ) {}

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug');
    if (slug) {
      this.isLoading = true;
      this.scpiService.getScpiDetails(slug).subscribe({
        next: (data) => {
          this.scpi = data;
          this.titleService.setTitle(`${data.name} - ${data.manager}`);
          this.isLoading = false;
        }
      });
    }
  }


    goBack(): void {
    this.router.navigate(['dashboard/scpi']);
  }

}
