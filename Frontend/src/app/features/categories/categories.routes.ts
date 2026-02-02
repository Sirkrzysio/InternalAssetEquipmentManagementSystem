

import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./categories-list/categories-list.component').then(c => c.CategoriesListComponent)
  },
  {
    path: 'create',
    loadComponent: () => import('./category-form/category-form.component').then(c => c.CategoryFormComponent)
  },
  {
    path: 'edit/:id',
    loadComponent: () => import('./category-form/category-form.component').then(c => c.CategoryFormComponent)
  }
];
