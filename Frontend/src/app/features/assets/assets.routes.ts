

import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./assets-list/assets-list.component').then(c => c.AssetsListComponent)
  },
  {
    path: 'create',
    loadComponent: () => import('./asset-form/asset-form.component').then(c => c.AssetFormComponent)
  },
  {
    path: 'edit/:id',
    loadComponent: () => import('./asset-form/asset-form.component').then(c => c.AssetFormComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('./asset-detail/asset-detail.component').then(c => c.AssetDetailComponent)
  }
];
