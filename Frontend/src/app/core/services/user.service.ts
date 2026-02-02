// User service - manages user API calls
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from './base-api.service';
import { User, CreateUserRequest, UpdateUserRequest } from '../models';

@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseApiService<User, CreateUserRequest, UpdateUserRequest> {
  protected readonly endpoint = 'users';

  /**
   * Deactivate user
   */
  deactivate(id: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${id}/deactivate`, {});
  }

  /**
   * Activate user
   */
  activate(id: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${id}/activate`, {});
  }
}
