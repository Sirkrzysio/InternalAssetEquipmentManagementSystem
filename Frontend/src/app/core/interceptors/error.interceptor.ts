
// ERROR INTERCEPTOR - Handles API Errors


import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { StorageService } from '../services/storage.service';

export const errorInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const router = inject(Router);
  const storageService = inject(StorageService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {

      // Handle 401 Unauthorized - redirect to login
      if (error.status === 401) {
        storageService.clear();
        router.navigate(['/auth/login']);
        return throwError(() => new Error('Unauthorized'));
      }

      // Handle 403 Forbidden
      if (error.status === 403) {
        router.navigate(['/forbidden']);
        return throwError(() => new Error('Forbidden'));
      }

      // Handle other errors
      let errorMessage = 'Wystąpił błąd serwera';

      if (error.error?.message) {
        errorMessage = error.error.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      return throwError(() => new Error(errorMessage));
    })
  );
};
