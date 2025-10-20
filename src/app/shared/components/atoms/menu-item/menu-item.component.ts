// src/app/shared/components/atoms/menu-item/menu-item.component.ts

import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-menu-item',
  standalone: true,
  imports: [CommonModule, RouterModule, IconComponent],
  templateUrl: './menu-item.component.html',
  styleUrl: './menu-item.component.scss'
})
export class MenuItemComponent {
  
  @Input({ required: true }) label!: string;
  @Input({ required: true }) route!: string;
  @Input({ required: true }) icon!: string;
  @Input() exact: boolean = false;

}