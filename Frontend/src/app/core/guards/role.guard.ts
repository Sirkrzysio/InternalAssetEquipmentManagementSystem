
// ROLE GUARD - Protects Routes Based on User Roles


import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { User, UserRole } from '../models';

export const roleGuard = (requiredRoles: UserRole[]): CanActivateFn => {
  return (route, state) => {
    const storageService = inject(StorageService);
    const router = inject(Router);

    const user = storageService.getUser<User>();

    if (!user) {
      router.navigate(['/auth/login']);
      return false;
    }

    if (requiredRoles.includes(user.role)) {
      return true;
    }

    // Redirect to forbidden page
    router.navigate(['/forbidden']);
    return false;
  };
};

// Predefined role guards for convenience
export const adminGuard: CanActivateFn = roleGuard([UserRole.Admin]);
export const managerGuard: CanActivateFn = roleGuard([UserRole.Admin, UserRole.Manager]);
export const employeeGuard: CanActivateFn = roleGuard([UserRole.Admin, UserRole.Manager, UserRole.Employee]);
