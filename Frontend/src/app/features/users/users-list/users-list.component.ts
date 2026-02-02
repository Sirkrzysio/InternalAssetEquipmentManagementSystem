

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <h1>Users Management</h1>
      <p>Users list - To be implemented</p>
    </div>
  `,
  styles: [`
    .container { padding: 20px; }
  `]
})
export class UsersListComponent {
}
