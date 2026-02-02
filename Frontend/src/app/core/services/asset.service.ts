

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { BaseApiService } from './base-api.service';
import { Asset, CreateAssetRequest, UpdateAssetRequest } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AssetService extends BaseApiService<Asset, CreateAssetRequest, UpdateAssetRequest> {
  protected readonly endpoint = 'assets';

  /**
   * Get assets by category
   */
  getByCategory(categoryId: string): Observable<Asset[]> {
    return this.http.get<Asset[]>(`${this.baseUrl}/category/${categoryId}`);
  }

  /**
   * Get assets by status
   */
  getByStatus(status: string): Observable<Asset[]> {
    return this.http.get<Asset[]>(`${this.baseUrl}/status/${status}`);
  }

  /**
   * Get assets by location
   */
  getByLocation(locationId: string): Observable<Asset[]> {
    return this.http.get<Asset[]>(`${this.baseUrl}/location/${locationId}`);
  }
}
