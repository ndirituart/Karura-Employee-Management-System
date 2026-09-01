import { Routes } from '@angular/router';
import { Dashboard } from './pages/dashboard/dashboard';
import { Layout } from './layout/layout';
import { Login } from './pages/login/login';
import { Employee } from './pages/employee/employee';
import { ProjectEmployee } from './pages/project-employee/project-employee';
import { Project } from './pages/project/project';

export const routes: Routes = [
  // Default redirect to login page
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Standalone standalone pages (without main header layout)
  { path: 'login', component: Login },

  // Pages wrapped inside your Layout (Header + Router Outlet)
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

  // Fallback wildcard route for broken links
  { path: '**', redirectTo: 'login' }
];
