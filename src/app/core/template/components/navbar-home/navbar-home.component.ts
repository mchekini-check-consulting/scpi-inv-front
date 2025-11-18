import { Component, HostListener } from '@angular/core';
import { AuthService } from '../../../service/auth.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-navbar-home',
  standalone: true,
  imports: [NgClass],
  templateUrl: './navbar-home.component.html',
  styleUrl: './navbar-home.component.scss',
})
export class NavbarHomeComponent {
  isScrolled = false;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 10;
  }
  constructor(private authService: AuthService) {}

  onLogin() {
    this.authService.login();
  }
}
