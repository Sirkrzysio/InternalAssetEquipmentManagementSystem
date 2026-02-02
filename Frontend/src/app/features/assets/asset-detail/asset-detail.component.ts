

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-asset-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <h1>Asset Details</h1>
      <p>Asset details view - To be implemented</p>
    </div>
  `,
  styles: [`
    .container { padding: 20px; }
  `]
})
export class AssetDetailComponent {
}
