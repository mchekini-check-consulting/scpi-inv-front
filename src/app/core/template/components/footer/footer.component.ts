import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface FooterLink {
  label: string;
  url: string;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
})
export class FooterComponent implements OnInit {
  year: number = 0;

  footerSections: FooterSection[] = [
    {
      title: 'Produit',
      links: [
        { label: 'Fonctionnalités', url: '#' },
        { label: 'Catalogue SCPI', url: '#' },
        { label: 'Simulateur', url: '#' },
        { label: 'Tarifs', url: '#' },
      ],
    },
    {
      title: 'Entreprise',
      links: [
        { label: 'À propos', url: '#' },
        { label: 'Blog', url: '#' },
        { label: 'Carrières', url: '#' },
        { label: 'Contact', url: '#' },
      ],
    },
  ];

  contactInfo = {
    email: 'contact@scpiinvest.fr',
    phone: '01 23 45 67 89',
    location: 'Paris, France',
  };

  legalLinks: FooterLink[] = [
    { label: 'Mentions légales', url: '#' },
    { label: 'Confidentialité', url: '#' },
    { label: 'CGV', url: '#' },
  ];

  ngOnInit(): void {
    this.year = new Date().getFullYear();
  }

  getPhoneLink(): string {
    return 'tel:' + this.contactInfo.phone.replace(/\s/g, '');
  }
}
