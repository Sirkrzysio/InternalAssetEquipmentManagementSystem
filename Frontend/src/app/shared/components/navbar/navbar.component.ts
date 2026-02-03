import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  private readonly authService = inject(AuthService);

  get currentUser() {
    return this.authService.currentUser;
  }

  get isAdmin() {
    return this.authService.hasRole('Admin');
  }

  get canManage() {
    return this.authService.hasAnyRole(['Admin', 'Manager']);
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        // Logout successful - AuthService already navigates to login
      },
      error: (error) => {
        console.error('Error during logout:', error);
        // Force logout locally even if server call fails
        this.authService['clearAuthData']();
        window.location.href = '/auth/login';
      }
    });
  }
}
