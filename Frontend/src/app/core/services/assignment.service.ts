

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from './base-api.service';
import { Assignment, CreateAssignmentRequest } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AssignmentService extends BaseApiService<Assignment, CreateAssignmentRequest, never> {
  protected readonly endpoint = 'assignments';

  /**
   * Get assignments by asset ID
   */
  getByAssetId(assetId: string): Observable<Assignment[]> {
    return this.http.get<Assignment[]>(`${this.baseUrl}/asset/${assetId}`);
  }

  /**
   * Get assignments by user ID
   */
  getByUserId(userId: string): Observable<Assignment[]> {
    return this.http.get<Assignment[]>(`${this.baseUrl}/user/${userId}`);
  }

  /**
   * Return asset (end assignment)
   */
  returnAsset(id: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${id}/return`, {});
  }
}
