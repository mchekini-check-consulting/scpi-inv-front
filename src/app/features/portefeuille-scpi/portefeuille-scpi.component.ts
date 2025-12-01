import { Component, ViewEncapsulation } from '@angular/core';
import { RevenusMensuelsComponent } from './portefeuille/revenus-mensuels/revenus-mensuels.component';
import { RevenusmensuelsComponent } from './portefeuille/revenusmensuels/revenusmensuels.component';
import { RepartitionGeographiqueComponent } from './portefeuille/repartition-geographique/repartition-geographique.component';
import { ListeInvestissementsComponent } from './portefeuille/liste-investissements/liste-investissements.component';
import { PortfolioSummaryComponent } from './portefeuille/portfolio-summary/portfolio-summary.component';
import { SectoralRepartitionComponent } from '../../core/template/components/sectoral-repartition/sectoral-repartition.component';

@Component({
  selector: 'app-portefeuille-scpi',
  standalone: true,
  imports: [RevenusMensuelsComponent, RevenusmensuelsComponent, SectoralRepartitionComponent, RepartitionGeographiqueComponent, ListeInvestissementsComponent, PortfolioSummaryComponent ],
  templateUrl: './portefeuille-scpi.component.html',
  styleUrl: './portefeuille-scpi.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class PortefeuilleScpiComponent {

}
