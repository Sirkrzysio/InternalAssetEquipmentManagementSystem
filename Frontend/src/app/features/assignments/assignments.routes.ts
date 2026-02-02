

import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./assignments-list/assignments-list.component').then(c => c.AssignmentsListComponent)
  },
  {
    path: 'create',
    loadComponent: () => import('./assignment-form/assignment-form.component').then(c => c.AssignmentFormComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('./assignment-detail/assignment-detail.component').then(c => c.AssignmentDetailComponent)
  }
];
