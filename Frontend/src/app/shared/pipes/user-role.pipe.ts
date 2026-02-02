// User role pipe - displays Polish role labels
import { Pipe, PipeTransform } from '@angular/core';
import { UserRole, UserRoleLabels } from '../../core/models/enums';

@Pipe({
  name: 'userRole',
  standalone: true
})
export class UserRolePipe implements PipeTransform {
  transform(role: UserRole): string {
    return UserRoleLabels[role] || 'Nieznana';
  }
}
