import { Component } from '@angular/core';
import { NavbarHomeComponent } from '../components/navbar-home/navbar-home.component';
import { RouterOutlet } from '@angular/router';
import { HerosectionComponent } from '../components/herosection/herosection.component';
import { FooterComponent } from '../components/footer/footer.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NavbarHomeComponent,HerosectionComponent ,FooterComponent,RouterOutlet],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
