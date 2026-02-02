

import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./audit-logs-list/audit-logs-list.component').then(c => c.AuditLogsListComponent)
  }
];
