import { Routes } from '@angular/router';
import { Dashboard } from './pages/dashboard/dashboard';
import { Layout } from './layout/layout';
import { Login } from './pages/login/login';
import { Employee } from './pages/employee/employee';
import { ProjectEmployee } from './pages/project-employee/project-employee';
import { Project } from './pages/project/project';

export const routes: Routes = [
  // 1. Fix default redirect (Redirect to login or dashboard)
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // 2. Standalone auth route (outside main layout)
  { path: 'login', component: Login },

  // 3. Authenticated routes wrapped inside Layout (Header + Navigation + Child Router Outlet)
  {
    path: '',
    component: Layout,
    children: [
      { path: 'dashboard', component: Dashboard },
      { path: 'employee', component: Employee },
      { path: 'project-employee', component: ProjectEmployee },
      { path: 'project', component: Project },
    ]
  },

  // 4. Fallback route for broken links
  { path: '**', redirectTo: 'login' }
];
