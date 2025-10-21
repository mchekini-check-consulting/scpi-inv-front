import {Routes} from '@angular/router';
import {TemplateComponent} from "./core/template/container/template.component";
import {ScpiCatalogComponent} from "./features/scpi-catalog/scpi-catalog.component";

export const routes: Routes = [

  {
    path: '', component: TemplateComponent, children: [
      {
        path: 'scpi', component: ScpiCatalogComponent
      }
    ],
  }


];
