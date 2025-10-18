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
      }
      // Tu pourras ajouter d'autres routes homepage ici
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
      // Tu pourras ajouter d'autres routes dashboard ici
      
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];