

import { UserRole } from './enums';

/**
 * User DTO - response from API
 */
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  department?: string;
  phoneNumber?: string;
  role: UserRole;
  roleName: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

/**
 * Create User Request
 */
export interface CreateUserRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  department?: string;
  phoneNumber?: string;
  role: UserRole;
}

/**
 * Update User Request
 */
export interface UpdateUserRequest {
  firstName: string;
  lastName: string;
  department?: string;
  phoneNumber?: string;
  role: UserRole;
}

/**
 * Login Request
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Login Response
 */
export interface LoginResponse {
  token: string;
  user: User;
  expiresAt: string;
}
