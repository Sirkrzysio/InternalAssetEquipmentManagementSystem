

import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./locations-list/locations-list.component').then(c => c.LocationsListComponent)
  },
  {
    path: 'create',
    loadComponent: () => import('./location-form/location-form.component').then(c => c.LocationFormComponent)
  },
  {
    path: 'edit/:id',
    loadComponent: () => import('./location-form/location-form.component').then(c => c.LocationFormComponent)
  }
];
