
// LOCATION FORM COMPONENT


import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-location-form',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <h1>Location Form</h1>
      <p>Create/Edit location - To be implemented</p>
    </div>
  `,
  styles: [`
    .container { padding: 20px; }
  `]
})
export class LocationFormComponent {
}
