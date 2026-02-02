

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-assignment-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <h1>Assignment Details</h1>
      <p>Assignment details - To be implemented</p>
    </div>
  `,
  styles: [`
    .container { padding: 20px; }
  `]
})
export class AssignmentDetailComponent {
}
