

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-asset-form',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <h1>Asset Form</h1>
      <p>Create/Edit Asset Form - To be implemented</p>
    </div>
  `,
  styles: [`
    .container { padding: 20px; }
  `]
})
export class AssetFormComponent {
}
