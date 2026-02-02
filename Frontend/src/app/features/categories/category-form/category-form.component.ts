

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <h1>Category Form</h1>
      <p>Create/Edit category - To be implemented</p>
    </div>
  `,
  styles: [`
    .container { padding: 20px; }
  `]
})
export class CategoryFormComponent {
}
