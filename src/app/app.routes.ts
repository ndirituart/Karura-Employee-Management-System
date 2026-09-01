import { Routes } from '@angular/router';
import { Dashboard } from './pages/dashboard/dashboard';

export const routes: Routes = [
  //default page for admins
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./pages/login/login').then(m => m.Login) },//refuses component: LoginComponent
  { path: 'dashboard', component: Dashboard },
  { path: 'project-employee', loadComponent: () => import('./pages/project-employee/project-employee').then(m => m.ProjectEmployee) },
  { path: 'project', loadComponent: () => import('./pages/project/project').then(m => m.Project) },

  // Add other page routes here
];
