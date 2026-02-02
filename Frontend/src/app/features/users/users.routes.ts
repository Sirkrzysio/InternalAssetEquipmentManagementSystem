

import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./users-list/users-list.component').then(c => c.UsersListComponent)
  },
  {
    path: 'create',
    loadComponent: () => import('./user-form/user-form.component').then(c => c.UserFormComponent)
  },
  {
    path: 'edit/:id',
    loadComponent: () => import('./user-form/user-form.component').then(c => c.UserFormComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('./user-detail/user-detail.component').then(c => c.UserDetailComponent)
  }
];
