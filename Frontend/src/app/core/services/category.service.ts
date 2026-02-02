

import { Injectable } from '@angular/core';
import { BaseApiService } from './base-api.service';
import { Category, CreateCategoryRequest, UpdateCategoryRequest } from '../models';

@Injectable({
  providedIn: 'root'
})
export class CategoryService extends BaseApiService<Category, CreateCategoryRequest, UpdateCategoryRequest> {
  protected readonly endpoint = 'categories';
}
