import { Pipe, PipeTransform } from '@angular/core';

import { userRoleTransformer } from '@shared/utils';

@Pipe({ name: 'userRole', standalone: true })
export class UserRolePipe implements PipeTransform {
  transform(role: string): string {
    return userRoleTransformer(role);
  }
}
