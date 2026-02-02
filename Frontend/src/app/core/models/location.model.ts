

/**
 * Location DTO - response from API
 */
export interface Location {
  id: string;
  name: string;
  address?: string;
  building?: string;
  floor?: string;
  room?: string;
  description?: string;
  assetCount: number;
  createdAt: string;
  updatedAt?: string;
}

/**
 * Create Location Request
 */
export interface CreateLocationRequest {
  name: string;
  address?: string;
  building?: string;
  floor?: string;
  room?: string;
  description?: string;
}

/**
 * Update Location Request
 */
export interface UpdateLocationRequest {
  name: string;
  address?: string;
  building?: string;
  floor?: string;
  room?: string;
  description?: string;
}
