import { Component } from '@angular/core';
import { IconComponent } from '../../../shared/components/atoms/icon/icon.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  
  userName: string = 'Meziani B.';

  onMenuClick(): void {
    console.log('===>, toggle sidebar');
  }


  onAvatarClick(): void {
    console.log('Avatar');

  }
}
