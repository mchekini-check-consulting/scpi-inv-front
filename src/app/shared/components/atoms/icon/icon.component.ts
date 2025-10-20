import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-icon',
  standalone: true,
  template: `<i [class]="'pi pi-' + name + ' ' + customClass"></i>`,
})
export class IconComponent {
  @Input({ required: true }) name!: string;
  @Input() customClass: string = '';
}
