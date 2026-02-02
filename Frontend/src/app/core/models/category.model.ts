

/**
 * Category DTO - response from API
 */
export interface Category {
  id: string;
  name: string;
  description?: string;
  code?: string;
  assetCount: number;
  createdAt: string;
  updatedAt?: string;
}

/**
 * Create Category Request
 */
export interface CreateCategoryRequest {
  name: string;
  description?: string;
  code?: string;
}

/**
 * Update Category Request
 */
export interface UpdateCategoryRequest {
  name: string;
  description?: string;
  code?: string;
}
