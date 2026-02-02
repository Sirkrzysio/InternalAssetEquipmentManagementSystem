
// FORBIDDEN COMPONENT - 403 Error Page


import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forbidden',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="error-container">
      <div class="error-content">
        <h1>403</h1>
        <h2>Brak uprawnień</h2>
        <p>Nie masz uprawnień do tej strony.</p>
        <button (click)="goBack()" class="back-btn">
          Powrót do Dashboard
        </button>
      </div>
    </div>
  `,
  styles: [`
    .error-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background-color: #f5f5f5;
    }

    .error-content {
      text-align: center;
      background: white;
      padding: 60px 40px;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }

    h1 {
      font-size: 72px;
      color: #e74c3c;
      margin: 0;
    }

    h2 {
      color: #333;
      margin: 20px 0;
    }

    p {
      color: #666;
      margin-bottom: 30px;
    }

    .back-btn {
      padding: 12px 24px;
      background-color: #3498db;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 16px;
    }

    .back-btn:hover {
      background-color: #2980b9;
    }
  `]
})
export class ForbiddenComponent {
  constructor(private router: Router) {}

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }
}
