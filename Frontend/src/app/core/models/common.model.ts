

/**
 * Paged Result - Generic paginated response from API
 */
export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

/**
 * API Error Response
 */
export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  statusCode?: number;
}

/**
 * Paged Request Parameters
 */
export interface PagedRequest {
  page?: number;
  pageSize?: number;
  searchTerm?: string;
  status?: number | string;
  isActive?: boolean;
  role?: number | string;
  entityName?: string;
  action?: string;
  dateFrom?: string;
  dateTo?: string;
}
