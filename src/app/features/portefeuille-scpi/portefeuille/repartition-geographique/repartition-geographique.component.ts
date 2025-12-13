import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { InvestmentService } from '../../../../services/investment.service';
import { GeoRepartitionComponent } from '../../../../core/template/components/geo-repartition/geo-repartition.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-repartition-geographique',
  standalone: true,
  imports: [GeoRepartitionComponent, CommonModule],
  templateUrl: './repartition-geographique.component.html',
  styleUrl: './repartition-geographique.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class RepartitionGeographiqueComponent implements OnInit {

  geographicalData: any[] = [];
  loading = false;

  constructor(private investmentService: InvestmentService) {}

  ngOnInit(): void {
    this.loadPortfolioDistribution();
  }

  loadPortfolioDistribution(): void {
    this.loading = true;
    
    this.investmentService.getPortfolioDistribution().subscribe({
      next: (data) => {
       
        this.geographicalData = (data.geographical || []).map(item => ({
          label: item.label,
          percentage: item.percentage,
          value: item.percentage
        }));
        
        this.loading = false;
        
      },
      error: (err) => {
        console.error('Erreur lors du chargement de la répartition géographique', err);
        this.loading = false;
      }
    });
  }

}
