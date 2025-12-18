import { Routes } from '@angular/router';
import { TemplateComponent } from "./core/template/container/template.component";
import { ScpiCatalogComponent } from "./features/scpi-catalog/scpi-catalog.component";
import { AuthGuard } from './core/guards/auth.guard';

import { HomeComponent } from "./core/template/home/home.component";
import { UploadFileComponent } from './features/upload-file/upload-file.component';
import { ScpiDetailComponent } from './features/scpi-detail/scpi-detail.component';
import { ScpiInvestComponent } from './features/scpi-invest/scpi-invest.component';
import { HistoryComponent } from "./features/history/history.component";
import { ComparatorScpiComponent } from './features/comparator-scpi/comparator-scpi.component';
import { ProfileComponent } from './profile/profile.component';
import { SimulationLayoutComponent } from './features/simulation/simulation-layout/simulation-layout.component';
import { PortefeuilleScpiComponent } from './features/portefeuille-scpi/portefeuille-scpi.component';
import { ScpiSimulatorHomeComponent } from './features/simulation/scpi-simulator-home/scpi-simulator-home.component';
import { ScheduledPaymentComponent } from './features/scheduled-payment/scheduled-payment.component';
import { SimulationListComponent } from './features/simulation/simulation-list/simulation-list.component';
import { PermissionGuard } from './core/guards/permissions.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },

  {
    path: 'dashboard',
    component: TemplateComponent,
    canActivate: [AuthGuard],
    children: [
      { 
        path: '', 
        redirectTo: 'scpi', 
        pathMatch: 'full' 
      },
      { 
        path: 'scpi', 
        component: ScpiCatalogComponent, 
        data: { feature: 'list-scpi' },
        canActivate: [PermissionGuard]
      },
      { 
        path: 'scpi/:id/invest', 
        component: ScpiInvestComponent,
        data: { feature: 'list-scpi' }, 
        canActivate: [PermissionGuard]
      },
      { 
        path: 'scpi/:slug', 
        component: ScpiDetailComponent,
        data: { feature: 'list-scpi' }, 
        canActivate: [PermissionGuard]
      },
      { 
        path: 'profile', 
        component: UploadFileComponent,
        data: { feature: 'profile' },
        canActivate: [PermissionGuard]
      },
      { 
        path: 'history', 
        component: HistoryComponent,
        data: { feature: 'history' },
        canActivate: [PermissionGuard]
      },
      { 
        path: 'comparator', 
        component: ComparatorScpiComponent,
        data: { feature: 'comparator' },
        canActivate: [PermissionGuard]
      },
      { 
        path: 'mon-profil', 
        component: ProfileComponent 
    
      },
      { 
        path: 'simulation', 
        component: ScpiSimulatorHomeComponent,
        data: { feature: 'simulation' },
        canActivate: [PermissionGuard]
      },
      { 
        path: 'simulation/nouvelle', 
        component: SimulationLayoutComponent,
        data: { feature: 'simulation' },
        canActivate: [PermissionGuard]
      },
      { 
        path: 'simulation/mes-simulations', 
        component: SimulationListComponent,
        data: { feature: 'simulation' },
        canActivate: [PermissionGuard]
      },
      { 
        path: 'portefeuille', 
        component: PortefeuilleScpiComponent,
        data: { feature: 'portefeuille' },
        canActivate: [PermissionGuard]
      },
      { 
        path: 'scheduled-payment', 
        component: ScheduledPaymentComponent,
        data: { feature: 'scheduled-payment' },
        canActivate: [PermissionGuard]
      }
    ]
  }
];
