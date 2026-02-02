// Storage service - manages localStorage operations
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  /**
   * Save JWT token to localStorage
   */
  setToken(token: string): void {
    localStorage.setItem(environment.tokenKey, token);
  }

  /**
   * Get JWT token from localStorage
   */
  getToken(): string | null {
    return localStorage.getItem(environment.tokenKey);
  }

  /**
   * Remove JWT token from localStorage
   */
  removeToken(): void {
    localStorage.removeItem(environment.tokenKey);
  }

  /**
   * Save user data to localStorage
   */
  setUser(user: any): void {
    localStorage.setItem(environment.userKey, JSON.stringify(user));
  }

  /**
   * Get user data from localStorage
   */
  getUser<T>(): T | null {
    const userData = localStorage.getItem(environment.userKey);
    return userData ? JSON.parse(userData) : null;
  }

  /**
   * Remove user data from localStorage
   */
  removeUser(): void {
    localStorage.removeItem(environment.userKey);
  }

  /**
   * Clear all storage
   */
  clear(): void {
    this.removeToken();
    this.removeUser();
  }
}
