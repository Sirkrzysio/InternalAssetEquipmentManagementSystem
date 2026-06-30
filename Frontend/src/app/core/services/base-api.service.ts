

import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PagedResult, PagedRequest } from '../models';

@Injectable()
export abstract class BaseApiService<T, TCreate = Partial<T>, TUpdate = Partial<T>> {
  protected readonly http = inject(HttpClient);
  protected abstract readonly endpoint: string;

  protected get baseUrl(): string {
    return `${environment.apiUrl}/${this.endpoint}`;
  }

  /**
   * Get all items
   */
  getAll(): Observable<T[]> {
    return this.http.get<T[]>(this.baseUrl);
  }

  /**
   * Get paged items
   */
  getPaged(request: PagedRequest): Observable<PagedResult<T>> {
    let params = new HttpParams();

    if (request.page) params = params.set('page', request.page.toString());
    if (request.pageSize) params = params.set('pageSize', request.pageSize.toString());
    if (request.searchTerm) params = params.set('searchTerm', request.searchTerm);
    if (request.status !== undefined) params = params.set('status', request.status.toString());
    if (request.isActive !== undefined) params = params.set('isActive', request.isActive.toString());
    if (request.role !== undefined) params = params.set('role', request.role.toString());
    if (request.entityName) params = params.set('entityName', request.entityName);
    if (request.action) params = params.set('action', request.action);
    if (request.dateFrom) params = params.set('dateFrom', request.dateFrom);
    if (request.dateTo) params = params.set('dateTo', request.dateTo);

    return this.http.get<PagedResult<T>>(`${this.baseUrl}/paged`, { params });
  }

  /**
   * Get item by ID
   */
  getById(id: string): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/${id}`);
  }

  /**
   * Create new item
   */
  create(item: TCreate): Observable<T> {
    return this.http.post<T>(this.baseUrl, item);
  }

  /**
   * Update existing item
   */
  update(id: string, item: TUpdate): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}/${id}`, item);
  }

  /**
   * Delete item
   */
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  /**
   * Restore deleted item
   */
  restore(id: string): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}/${id}/restore`, {});
  }
}
