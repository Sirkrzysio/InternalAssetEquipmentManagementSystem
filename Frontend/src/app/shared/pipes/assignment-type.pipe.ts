

import { Pipe, PipeTransform } from '@angular/core';
import { AssignmentType, AssignmentTypeLabels } from '../../core/models/enums';

@Pipe({
  name: 'assignmentType',
  standalone: true
})
export class AssignmentTypePipe implements PipeTransform {
  transform(type: AssignmentType): string {
    return AssignmentTypeLabels[type] || 'Nieznany';
  }
}
