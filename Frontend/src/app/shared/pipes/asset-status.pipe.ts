

import { Pipe, PipeTransform } from '@angular/core';
import { AssetStatus, AssetStatusLabels } from '../../core/models/enums';

@Pipe({
  name: 'assetStatus',
  standalone: true
})
export class AssetStatusPipe implements PipeTransform {
  transform(status: AssetStatus): string {
    return AssetStatusLabels[status] || 'Nieznany';
  }
}
