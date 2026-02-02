

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-assignment-form',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <h1>Assignment Form</h1>
      <p>Create assignment - To be implemented</p>
    </div>
  `,
  styles: [`
    .container { padding: 20px; }
  `]
})
export class AssignmentFormComponent {
}
