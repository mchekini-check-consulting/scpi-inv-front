import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-navbar-home',
  standalone: true,
  imports: [],
  templateUrl: './navbar-home.component.html',
  styleUrl: './navbar-home.component.scss'
})
export class NavbarHomeComponent {

constructor(private authService:AuthService){}

  onLogin(){
      this.authService.login();
      console.log("ici login");
  }

}
