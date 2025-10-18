import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../atoms/button/button.component';
import { DialogComponent } from '../../molecules/dialog/dialog.component';
import { FormFieldComponent } from '../../molecules/form-field/form-field.component';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, ButtonComponent, DialogComponent, FormFieldComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  isLoginDialogOpen = false;
  
  onLogin(): void {
    console.log('Naviguer vers login');
    // TODO: Navigation vers /login
    this.isLoginDialogOpen = true;
  }

  onRegister(): void {
    console.log('Naviguer vers register');
    // TODO: Navigation vers /register
  }

  closeLoginDialog(): void {
    this.isLoginDialogOpen = false
  }
}