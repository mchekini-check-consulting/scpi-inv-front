import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { HomeLayoutComponent } from './core/layouts/home-layout/home-layout.component';
import { DashboardLayoutComponent } from './core/layouts/dashboard-layout/dashboard-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeLayoutComponent,
    children: [
      {
        path: '',
        component: HomeComponent
      },
      // TODO: Ajouter des autres features ici
     
      
    ]
  },
  {
    path: 'dashboard',
    component: DashboardLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () => 
          import('./features/dashboard/dashboard.component')
            .then(m => m.DashboardComponent)
      }
      // TODO: Ajouter des autres features ici
      
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
