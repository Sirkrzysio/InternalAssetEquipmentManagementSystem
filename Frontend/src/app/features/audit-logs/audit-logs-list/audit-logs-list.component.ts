

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-audit-logs-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <h1>Audit Logs</h1>
      <p>Audit logs list - To be implemented</p>
    </div>
  `,
  styles: [`
    .container { padding: 20px; }
  `]
})
export class AuditLogsListComponent {
}
