import {Routes} from '@angular/router';
import {TemplateComponent} from "./core/template/container/template.component";
import {ScpiCatalogComponent} from "./features/scpi-catalog/scpi-catalog.component";
import {AuthGuard} from './core/guards/auth.guard';
import {HomeComponent} from "./core/template/home/home.component";
import {UploadFileComponent} from './features/upload-file/upload-file.component';
import {HistoryComponent} from "./features/history/history.component";
import {ScpiInvestComponent} from './features/scpi-invest/scpi-invest.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'dashboard',
    component: TemplateComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'scpi', component: ScpiCatalogComponent },
      { path: 'scpi/:id/invest', component: ScpiInvestComponent },
      { path: 'profile', component: UploadFileComponent },
      { path: 'history', component: HistoryComponent }
    ]
  }
];
