import { Component, ViewEncapsulation } from '@angular/core';
import { MontantTotalInvestiComponent } from './portefeuille/montant-total-investi/montant-total-investi.component';
import { RevenusmensuelsComponent } from './portefeuille/revenusmensuels/revenusmensuels.component';
import { RepartitionSectorielleComponent } from './portefeuille/repartition-sectorielle/repartition-sectorielle.component';
import { RepartitionGeographiqueComponent } from './portefeuille/repartition-geographique/repartition-geographique.component';
import { ListeInvestissementsComponent } from './portefeuille/liste-investissements/liste-investissements.component';
import { PortfolioSummaryComponent } from './portefeuille/portfolio-summary/portfolio-summary.component';

@Component({
  selector: 'app-portefeuille-scpi',
  standalone: true,
  imports: [MontantTotalInvestiComponent, RevenusmensuelsComponent, RepartitionSectorielleComponent, RepartitionGeographiqueComponent, ListeInvestissementsComponent, PortfolioSummaryComponent ],
  templateUrl: './portefeuille-scpi.component.html',
  styleUrl: './portefeuille-scpi.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class PortefeuilleScpiComponent {

}
