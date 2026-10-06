import { Routes } from '@angular/router';
import { Dashboard } from './pages/dashboard/dashboard';
import { Layout } from './layout/layout';
import { Login } from './pages/login/login';
import { Employee } from './pages/employee/employee';
import { ProjectEmployee } from './pages/project-employee/project-employee';
import { Project } from './pages/project/project';

//issues with routing were causing the navigation links to fail
export const routes: Routes = [
  { path: 'login', component: Login },

  {
    path: '',
    component: Layout,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },  // default child
      { path: 'dashboard', component: Dashboard },
      { path: 'employee', component: Employee },
      { path: 'project', component: Project },
      { path: 'project-employee', component: ProjectEmployee },
    ]
  },

  { path: '**', redirectTo: '' }
];
