
// ERROR PAGES ROUTES


import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./forbidden/forbidden.component').then(c => c.ForbiddenComponent)
  }
];
