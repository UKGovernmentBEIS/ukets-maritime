import { Pipe, PipeTransform } from '@angular/core';

import { RequestActionUserInfo } from '@mrtm/api';

import { userContactTransformer, userRoleTransformer } from '@shared/utils';

@Pipe({
  name: 'userInfoResolver',
  standalone: true,
})
export class UserInfoResolverPipe implements PipeTransform {
  transform(userId: string, info: { [key: string]: RequestActionUserInfo }, withContactTypes: boolean = true): string {
    const user = info[userId];
    const roleCode: string = user.roleCode ? `, ${userRoleTransformer(user.roleCode)}` : '';
    const contacts: string =
      user.contactTypes?.length > 0 ? ` - ${user.contactTypes.map((c) => userContactTransformer(c)).join(', ')}` : '';
    return `${user.name}${roleCode}${withContactTypes ? contacts : ''}`;
  }
}
