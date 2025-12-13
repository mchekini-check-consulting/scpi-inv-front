import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ScpiCardComponent } from '../scpi-card/scpi-card.component';
import { Scpi } from '../../../model/scpi.model';
import { AuthService } from '../../../service/auth.service';

interface Advantage {
  icon: string;
  title: string;
  description: string;
}

interface Step {
  number: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  imagePosition: 'left' | 'right';
}

@Component({
  selector: 'app-herosection',
  standalone: true,
  imports: [CardModule, ButtonModule, CommonModule],
  templateUrl: './herosection.component.html',
  styleUrl: './herosection.component.scss',
})
export class HerosectionComponent {
  advantages: Advantage[] = [
    {
      icon: 'pi-file',
      title: 'Catalogue exhaustif',
      description: 'Accédez à plus de 100 SCPI partenaires avec toutes les données actualisées en temps réel.'
    },
    {
      icon: 'pi-calculator',
      title: 'Simulateurs avancés',
      description: 'Calculez vos rendements potentiels et optimisez votre stratégie d\'investissement.'
    },
    {
      icon: 'pi-chart-bar',
      title: 'Comparateurs intelligents',
      description: 'Comparez les performances, les frais et les caractéristiques de chaque SCPI.'
    },
    {
      icon: 'pi-clock',
      title: 'Portefeuille unique',
      description: 'Centralisez tous vos investissements SCPI dans un tableau de bord unifié.'
    },
    {
      icon: 'pi-th-large',
      title: 'Agrégation des données',
      description: 'Visualisez la performance globale de votre portefeuille en un coup d\'œil.'
    },
    {
      icon: 'pi-shield',
      title: 'Sécurité maximale',
      description: 'Vos données sont protégées avec les standards de sécurité les plus élevés.'
    }
  ];

  steps: Step[] = [
    {
      number: '01',
      title: 'Créez votre compte',
      description: 'Inscrivez-vous gratuitement en quelques minutes et accédez à notre plateforme.',
      image: 'img/person-creating-account-on-modern-laptop-in-bright.jpg',
      imageAlt: 'Femme créant son compte sur la plateforme SCPI Invest',
      imagePosition: 'right'
    },
    {
      number: '02',
      title: 'Explorez le catalogue',
      description: 'Parcourez plus de 100 SCPI et comparez leurs performances avec nos outils.',
      image: 'img/financial-charts-and-scpi-portfolio-comparison-on-.jpg',
      imageAlt: 'Tablette affichant le catalogue SCPI Portfolio',
      imagePosition: 'left'
    },
    {
      number: '03',
      title: 'Investissez et suivez',
      description: 'Constituez votre portefeuille et suivez vos investissements en temps réel.',
      image: 'img/professional-investment-dashboard-with-real-time-d.jpg',
      imageAlt: 'Dashboard Investment Portfolio Analytics',
      imagePosition: 'right'
    }
  ];
}
