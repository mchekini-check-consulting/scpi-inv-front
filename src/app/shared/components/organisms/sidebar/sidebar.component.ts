import { NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MenuItem } from '../../../../types/ui/menu-item.types'
import { MenuItemComponent } from '../../atoms/menu-item/menu-item.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [NgFor, MenuItemComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {

  menuItems: MenuItem[] = [
    {
      label: 'Dashboard',
      route: '/dashboard',
      icon: 'home',
      exact: true,
    },
    {
      label: 'SCPI',
      route: '/dashboard/scpi',
      icon: 'building'
    }
    // TODO: Ajouter d'autres items ici
  ];

}
