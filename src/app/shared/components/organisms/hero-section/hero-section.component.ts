import { NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';
import { ButtonComponent } from '../../atoms/button/button.component';

@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [NgOptimizedImage, ButtonComponent],
  templateUrl: './hero-section.component.html',
  styleUrl: './hero-section.component.scss',
})
export class HeroSectionComponent {
  navigateToScpi(): void {
    console.log('===> hero section');
  }
}
