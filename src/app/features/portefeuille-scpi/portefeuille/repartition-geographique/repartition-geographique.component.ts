import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvestmentService } from '../../../../services/investment.service';
import { GeoRepartitionComponent } from '../../../../core/template/components/geo-repartition/geo-repartition.component';

@Component({
  selector: 'app-repartition-geographique',
  standalone: true,
  imports: [CommonModule, GeoRepartitionComponent],
  templateUrl: './repartition-geographique.component.html',
  styleUrl: './repartition-geographique.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class RepartitionGeographiqueComponent implements OnInit {

  geographicalData: any[] = [];
  loading = false;
  totalInvested: number = 0;

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
          amount: item.amount,
          value: item.percentage
        }));
        
        this.totalInvested = data.totalInvestedAmount;
        this.loading = false;
        
        console.log('Données géographiques chargées:', this.geographicalData);
        console.log('Total investi:', this.totalInvested);
      },
      error: (err) => {
        console.error('Erreur lors du chargement de la répartition géographique', err);
        this.geographicalData = [];
        this.loading = false;
      }
    });
  }


  getCountryColor(percentage: number): string {
    if (percentage > 40) return '#2E7D32'; 
    if (percentage > 20) return '#66BB6A';  
    if (percentage > 10) return '#A5D6A7'; 
    if (percentage > 5) return '#C8E6C9';  
    return '#E8F5E9';  
  }
}