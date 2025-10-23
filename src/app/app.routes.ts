import {Routes} from '@angular/router';
import {TemplateComponent} from "./core/template/container/template.component";
import {ScpiCatalogComponent} from "./features/scpi-catalog/scpi-catalog.component";
import { UploadFileComponent } from './features/upload-file/upload-file.component';

export const routes: Routes = [

  {
    path: '', component: TemplateComponent, children: [
      {
        path: 'scpi', component: ScpiCatalogComponent
      },
      { path: 'profile', component: UploadFileComponent },
    ],
  }


];
