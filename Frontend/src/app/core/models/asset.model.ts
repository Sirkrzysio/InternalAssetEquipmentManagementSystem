
import { AssetStatus } from './enums';

/**
 * Asset DTO - response from API
 */
export interface Asset {
  id: string;
  name: string;
  serialNumber: string;
  description?: string;
  manufacturer?: string;
  model?: string;
  purchasePrice: number;
  purchaseDate: string;
  warrantyExpiration?: string;
  status: AssetStatus;
  statusName: string;
  categoryId: string;
  categoryName?: string;
  locationId?: string;
  locationName?: string;
  createdAt: string;
  updatedAt?: string;
}

/**
 * Create Asset Request
 */
export interface CreateAssetRequest {
  name: string;
  serialNumber: string;
  description?: string;
  manufacturer?: string;
  model?: string;
  purchasePrice: number;
  purchaseDate: string;
  warrantyExpiration?: string;
  status: AssetStatus;
  categoryId: string;
  locationId?: string;
}

/**
 * Update Asset Request
 */
export interface UpdateAssetRequest {
  name: string;
  serialNumber: string;
  description?: string;
  manufacturer?: string;
  model?: string;
  purchasePrice: number;
  purchaseDate: string;
  warrantyExpiration?: string;
  status: AssetStatus;
  categoryId: string;
  locationId?: string;
}
