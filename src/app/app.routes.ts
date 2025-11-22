import {Routes} from '@angular/router';
import {TemplateComponent} from "./core/template/container/template.component";
import {ScpiCatalogComponent} from "./features/scpi-catalog/scpi-catalog.component";
import { AuthGuard } from './core/guards/auth.guard';
import {HomeComponent} from "./core/template/home/home.component";
import { UploadFileComponent } from './features/upload-file/upload-file.component';
import { ScpiDetailComponent } from './features/scpi-detail/scpi-detail.component';
import { ScpiInvestComponent } from './features/scpi-invest/scpi-invest.component';
import {HistoryComponent} from "./features/history/history.component";
import { ComparatorScpiComponent } from './features/comparator-scpi/comparator-scpi.component';
import { ScpiSimulatorComponent } from './features/simulation/scpi-simulator/scpi-simulator.component';
import { SimulationNewComponent } from './features/simulation/simulation-new/simulation-new.component';

export const routes: Routes = [

  {
    path : '', component : HomeComponent
  },
  {
    path: 'dashboard', component: TemplateComponent, canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'scpi', pathMatch: 'full' },
      { path: 'scpi', component: ScpiCatalogComponent, pathMatch: 'full' },
      { path: 'scpi/:id/invest', component: ScpiInvestComponent },
      { path: 'scpi/:slug', component: ScpiDetailComponent },
      { path: 'profile', component: UploadFileComponent },
      { path: 'history', component: HistoryComponent },
      { path: 'comparator', component: ComparatorScpiComponent },
      { path: 'simulation', component: ScpiSimulatorComponent },
      { path: 'simulation/nouvelle', component: SimulationNewComponent}

    ],
  }

];
