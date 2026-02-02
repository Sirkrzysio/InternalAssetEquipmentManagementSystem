

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { BaseApiService } from './base-api.service';
import { AuditLog, PagedResult, PagedRequest } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AuditLogService extends BaseApiService<AuditLog, never, never> {
  protected readonly endpoint = 'auditlogs';

  /**
   * Get audit logs by entity
   */
  getByEntity(entityName: string, entityId: string): Observable<AuditLog[]> {
    return this.http.get<AuditLog[]>(`${this.baseUrl}/entity/${entityName}/${entityId}`);
  }

  /**
   * Get audit logs by user
   */
  getByUser(userId: string): Observable<AuditLog[]> {
    return this.http.get<AuditLog[]>(`${this.baseUrl}/user/${userId}`);
  }

  // Override methods that don't apply to audit logs
  override create(): Observable<AuditLog> {
    throw new Error('Audit logs cannot be created directly');
  }

  override update(): Observable<AuditLog> {
    throw new Error('Audit logs cannot be updated');
  }

  override delete(): Observable<void> {
    throw new Error('Audit logs cannot be deleted');
  }
}
