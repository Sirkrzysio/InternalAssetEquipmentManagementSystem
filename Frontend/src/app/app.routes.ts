

import { Routes } from '@angular/router';
import { authGuard, adminGuard, managerGuard } from './core/index';

export const routes: Routes = [
  // Default redirect
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },

  // Authentication (no guard - public access)
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.routes)
  },

  // Dashboard (authenticated users)
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadChildren: () => import('./features/dashboard/dashboard.routes').then(m => m.routes)
  },

  // Assets (authenticated users)
  {
    path: 'assets',
    canActivate: [authGuard],
    loadChildren: () => import('./features/assets/assets.routes').then(m => m.routes)
  },

  // Assignments (authenticated users)
  {
    path: 'assignments',
    canActivate: [authGuard],
    loadChildren: () => import('./features/assignments/assignments.routes').then(m => m.routes)
  },

  // Users (Admin/Manager only)
  {
    path: 'users',
    canActivate: [managerGuard],
    loadChildren: () => import('./features/users/users.routes').then(m => m.routes)
  },

  // Categories (Admin/Manager only)
  {
    path: 'categories',
    canActivate: [managerGuard],
    loadChildren: () => import('./features/categories/categories.routes').then(m => m.routes)
  },

  // Locations (Admin/Manager only)
  {
    path: 'locations',
    canActivate: [managerGuard],
    loadChildren: () => import('./features/locations/locations.routes').then(m => m.routes)
  },

  // Audit Logs (Admin only)
  {
    path: 'audit-logs',
    canActivate: [adminGuard],
    loadChildren: () => import('./features/audit-logs/audit-logs.routes').then(m => m.routes)
  },

  // Error pages
  {
    path: 'forbidden',
    loadChildren: () => import('./features/errors/errors.routes').then(m => m.routes)
  },

  // Wildcard - redirect to dashboard
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];
