// Location service - manages location API calls
import { Injectable } from '@angular/core';
import { BaseApiService } from './base-api.service';
import { Location, CreateLocationRequest, UpdateLocationRequest } from '../models';

@Injectable({
  providedIn: 'root'
})
export class LocationService extends BaseApiService<Location, CreateLocationRequest, UpdateLocationRequest> {
  protected readonly endpoint = 'locations';
}
