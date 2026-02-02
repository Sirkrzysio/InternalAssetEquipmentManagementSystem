

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <h1>User Details</h1>
      <p>User details - To be implemented</p>
    </div>
  `,
  styles: [`
    .container { padding: 20px; }
  `]
})
export class UserDetailComponent {
}
