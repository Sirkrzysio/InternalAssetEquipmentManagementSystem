

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-locations-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <h1>Locations</h1>
      <p>Locations list - To be implemented</p>
    </div>
  `,
  styles: [`
    .container { padding: 20px; }
  `]
})
export class LocationsListComponent {
}
