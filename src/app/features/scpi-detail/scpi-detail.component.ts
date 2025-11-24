import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Subject, takeUntil } from 'rxjs';
import { ScpiService } from '../../services/scpi.service';
import { ScpiDetail } from '../../models/scpi.model';
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { FormatFieldPipe } from '../../core/pipe/format-field.pipe';
import { SectoralRepartitionComponent } from '../../core/template/components/sectoral-repartition/sectoral-repartition.component';
import { ScpiRepartition } from '../../models/scpi-repartition.model';
import { PerformanceHistoryComponent } from '../performance-history-scpi/performance-history/performance-history.component';
import { ScpiValuationGraphComponent } from "../scpi-valuation-graph/scpi-valuation-graph.component";
import { TabsModule } from 'primeng/tabs';
import {GeoRepartitionComponent} from "../../core/template/components/geo-repartition/geo-repartition.component";

@Component({
  selector: 'app-scpi-detail',
  standalone: true,
  imports: [
    CommonModule,
    AccordionModule,
    ButtonModule,
    FormatFieldPipe,
    SectoralRepartitionComponent,
    PerformanceHistoryComponent,
    ScpiValuationGraphComponent,
    TabsModule,
    GeoRepartitionComponent
  ],
  templateUrl: './scpi-detail.component.html',
  styleUrls: ['./scpi-detail.component.scss'],
})
export class ScpiDetailComponent implements OnInit, OnDestroy {
  scpi?: ScpiDetail;
  repartition?: ScpiRepartition;
  isLoading = false;
  error?: string;

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private scpiService: ScpiService,
    private router: Router,
    private titleService: Title,
  ) {}

  ngOnInit(): void {
    this.loadScpiDetails();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadScpiDetails(): void {
    const slug = this.route.snapshot.paramMap.get('slug');
    if (!slug) {
      this.error = 'SCPI non trouvée';
      return;
    }

    this.isLoading = true;
    this.scpiService.getScpiDetails(slug)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.scpi = data;
          this.titleService.setTitle(`${data.name} - ${data.manager}`);
          this.isLoading = false;

          if (data.id) {
            this.loadRepartition(data.id);
          }
        },
        error: (err) => {
          this.error = 'Impossible de charger les détails de la SCPI';
          this.isLoading = false;
          console.error('Error loading SCPI details:', err);
        }
      });
  }

  private loadRepartition(scpiId: number): void {
    this.scpiService.getScpiRepartition(scpiId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.repartition = data;
        },
        error: (err) => {
          console.error('Erreur lors du chargement de la répartition:', err);
        }
      });
  }


  goBack(): void {
    this.router.navigate(['dashboard/scpi']);
  }
}
