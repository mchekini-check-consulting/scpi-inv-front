import { Component } from '@angular/core';
import { CommonModule } from "@angular/common";


import { ButtonModule } from 'primeng/button';

import { CardModule } from 'primeng/card';
@Component({
  selector: 'app-herosection',
  standalone: true,
  imports: [CardModule,ButtonModule,CommonModule],
  templateUrl: './herosection.component.html',
  styleUrl: './herosection.component.scss'
})
export class HerosectionComponent {
cards = [
  {
    title: 'SCPI Résidentiel',
    subtitle: 'Investissement locatif',
    content: 'Investissez dans des biens résidentiels avec un rendement stable et sécurisé.',
    image: '../../img/scpi/1.webp'
  },
  {
    title: 'SCPI Bureaux',
    subtitle: 'Placement professionnel',
    content: 'Diversifiez votre portefeuille avec des immeubles de bureaux modernes.',
    image: '../../img/scpi/2.webp'
  },
  {
    title: 'SCPI Santé',
    subtitle: 'Investir dans le médical',
    content: 'Profitez de la croissance du secteur de la santé et du bien-être.',
    image: '../../img/scpi/3.webp'
  },
  {
    title: 'SCPI Commerces',
    subtitle: 'Revenus réguliers',
    content: 'Accédez à un rendement stable grâce aux surfaces commerciales louées.',
    image: '../../img/scpi/7.webp'
  },
  {
    title: 'SCPI Santé',
    subtitle: 'Investir dans le médical',
    content: 'Profitez de la croissance du secteur de la santé et du bien-être.',
    image: '../../img/scpi/5.webp'
  },
  {
    title: 'SCPI Commerces',
    subtitle: 'Revenus réguliers',
    content: 'Accédez à un rendement stable grâce aux surfaces commerciales louées.',
    image: '../../img/scpi/9.webp'
  },
  {
    title: 'SCPI Commerces',
    subtitle: 'Revenus réguliers',
    content: 'Accédez à un rendement stable grâce aux surfaces commerciales louées.',
    image: '../../img/scpi/7.webp'
  },
  {
    title: 'SCPI Commerces',
    subtitle: 'Revenus réguliers',
    content: 'Accédez à un rendement stable grâce aux surfaces commerciales louées.',
    image: '../../img/scpi/7.webp'
  }

];

}
