import { Routes } from '@angular/router';
import { authGuard, adminGuard, managerGuard } from './core/index';
import { LayoutComponent } from './shared/components/layout/layout.component';

export const routes: Routes = [
  // Default redirect
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },

  // Authentication (no guard - public access, no layout)
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.routes)
  },

  // Main application with layout (all protected routes)
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      // Dashboard
      {
        path: 'dashboard',
        loadChildren: () => import('./features/dashboard/dashboard.routes').then(m => m.routes)
      },

      // Assets
      {
        path: 'assets',
        loadChildren: () => import('./features/assets/assets.routes').then(m => m.routes)
      },

      // Assignments
      {
        path: 'assignments',
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
      }
    ]
  },

  // Error pages (outside layout)
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
