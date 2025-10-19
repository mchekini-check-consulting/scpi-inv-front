import { Component } from '@angular/core';
import { HeroSectionComponent } from '../../shared/components/organisms/hero-section/hero-section.component';




@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeroSectionComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {}