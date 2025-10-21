import {Routes} from '@angular/router';
import {TemplateComponent} from "./core/template/container/template.component";
import {ScpiCatalogComponent} from "./features/scpi-catalog/scpi-catalog.component";
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [

  {
    path: '', component: TemplateComponent, 
     canActivate: [AuthGuard], data: { roles: ['user']},
    children: [
      {
        path: 'scpi', component: ScpiCatalogComponent,
        
      }
    ],
  }


];
