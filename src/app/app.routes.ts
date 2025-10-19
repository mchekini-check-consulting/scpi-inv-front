import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { HomeLayoutComponent } from './core/layouts/home-layout/home-layout.component';
import { DashboardLayoutComponent } from './core/layouts/dashboard-layout/dashboard-layout.component';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: HomeLayoutComponent,
    children: [
      {
        path: '',
        component: HomeComponent
      }
    ]
  },
  {
    path: 'dashboard',
    component: DashboardLayoutComponent,
    canActivate: [AuthGuard], data: { roles: ['user']},
    children: [
      {
        path: 'dashboard',
        loadComponent: () => 
          import('./features/dashboard/dashboard.component')
            .then(m => m.DashboardComponent)
      }
      
    ]
  },  
  {
    path: '**',
    redirectTo: '/forbiden'
  }
];
