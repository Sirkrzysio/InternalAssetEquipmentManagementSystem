

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-assignments-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <h1>Assignments</h1>
      <p>Assignments list - To be implemented</p>
    </div>
  `,
  styles: [`
    .container { padding: 20px; }
  `]
})
export class AssignmentsListComponent {
}
