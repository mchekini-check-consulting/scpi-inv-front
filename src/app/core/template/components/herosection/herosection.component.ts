import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ScpiCardComponent } from '../scpi-card/scpi-card.component';
import { Scpi } from '../../../../models/scpi.model';
import { AuthService } from '../../../service/auth.service';


@Component({
  selector: 'app-herosection',
  standalone: true,
  imports: [CardModule, ButtonModule, CommonModule, ScpiCardComponent],
  templateUrl: './herosection.component.html',
  styleUrl: './herosection.component.scss',
})
export class HerosectionComponent {
  @ViewChild('cardsSection') cardsSection!: ElementRef;

  currentSlideIndex = 0;
  cardsPerView = 4;

  // Mock data basé sur tes cards mais au format Scpi
  mockScpis: Scpi[] = [
    {
      id: 1,
      name: 'SCPI Résidentiel',
      manager: 'Investissement locatif',
      advertising: 'Investissez dans des biens résidentiels avec un rendement stable et sécurisé.',
      imageUrl: '../../img/scpi/1.webp',
      country: 'France',
      cashback: 5,
      distributionRate: 8.35,
      minimumSubscription: 5000,
    },
    {
      id: 2,
      name: 'SCPI Bureaux',
      manager: 'Placement professionnel',
      advertising: 'Diversifiez votre portefeuille avec des immeubles de bureaux modernes.',
      imageUrl: '../../img/scpi/2.webp',
      country: 'Europe',
      cashback: 0,
      distributionRate: 8.0,
      minimumSubscription: 2850,
    },
    {
      id: 3,
      name: 'SCPI Santé',
      manager: 'Investir dans le médical',
      advertising: 'Profitez de la croissance du secteur de la santé et du bien-être.',
      imageUrl: '../../img/scpi/3.webp',
      country: 'France',
      cashback: 0,
      distributionRate: 8.0,
      minimumSubscription: 1000,
    },
    {
      id: 4,
      name: 'SCPI Commerces',
      manager: 'Revenus réguliers',
      advertising: 'Accédez à un rendement stable grâce aux surfaces commerciales louées.',
      imageUrl: '../../img/scpi/7.webp',
      country: 'Pays-Bas',
      cashback: 0,
      distributionRate: 7.5,
      minimumSubscription: 3500,
    },
    {
      id: 5,
      name: 'SCPI Logistique',
      manager: 'Secteur en croissance',
      advertising: 'Profitez de la forte demande en entrepôts et plateformes logistiques.',
      imageUrl: '../../img/scpi/5.webp',
      country: 'Allemagne',
      cashback: 2,
      distributionRate: 6.8,
      minimumSubscription: 4000,
    },
    {
      id: 6,
      name: 'SCPI Hôtellerie',
      manager: 'Tourisme et loisirs',
      advertising: "Investissez dans le secteur dynamique de l'hôtellerie et du tourisme.",
      imageUrl: '../../img/scpi/9.webp',
      country: 'Espagne',
      cashback: 3,
      distributionRate: 7.2,
      minimumSubscription: 2500,
    },
    {
      id: 7,
      name: 'SCPI International',
      manager: 'Diversification mondiale',
      advertising: 'Accédez aux marchés internationaux avec une SCPI européenne.',
      imageUrl: '../../img/scpi/7.webp',
      country: 'Europe',
      cashback: 0,
      distributionRate: 6.5,
      minimumSubscription: 5000,
    },
    {
      id: 8,
      name: 'SCPI Éco-responsable',
      manager: 'Immobilier durable',
      advertising: 'Investissez dans des bâtiments éco-responsables et certifiés.',
      imageUrl: '../../img/scpi/7.webp',
      country: 'France',
      cashback: 4,
      distributionRate: 7.8,
      minimumSubscription: 3000,
    },
  ];

  constructor(private authService: AuthService) {
    this.updateCardsPerView();
    window.addEventListener('resize', () => this.updateCardsPerView());
  }

  updateCardsPerView(): void {
    if (window.innerWidth < 768) {
      this.cardsPerView = 1;
    } else if (window.innerWidth < 1024) {
      this.cardsPerView = 2;
    } else if (window.innerWidth < 1280) {
      this.cardsPerView = 3;
    } else {
      this.cardsPerView = 4;
    }
  }

  scrollToCards(): void {
    this.cardsSection.nativeElement.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }

  nextSlide(): void {
    if (this.currentSlideIndex < this.mockScpis.length - this.cardsPerView) {
      this.currentSlideIndex++;
    }
  }

  previousSlide(): void {
    if (this.currentSlideIndex > 0) {
      this.currentSlideIndex--;
    }
  }

  goToSlide(index: number): void {
    this.currentSlideIndex = index;
  }

  getDotsArray(): number[] {
    const totalDots = Math.max(1, this.mockScpis.length - this.cardsPerView + 1);
    return Array(totalDots).fill(0);
  }

  onCardViewMore(): void {
    this.authService.login();
  }

  onCardInvest(): void {
    this.authService.login();
  }
}