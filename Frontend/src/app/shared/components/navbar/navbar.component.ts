import { Component, ElementRef, ViewChild, inject } from '@angular/core';
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
  @ViewChild('menuToggle') private menuToggle?: ElementRef<HTMLButtonElement>;
  isMenuOpen = false;

  get currentUser() {
    return this.authService.currentUser;
  }

  get isAdmin() {
    return this.authService.hasRole('Admin');
  }

  get canManage() {
    return this.authService.hasAnyRole(['Admin', 'Manager']);
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu(): void {
    this.isMenuOpen = false;
  }

  closeMenuFromKeyboard(): void {
    if (!this.isMenuOpen) {
      return;
    }

    this.closeMenu();
    this.menuToggle?.nativeElement.focus();
  }

  logout(): void {
    this.closeMenu();
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
