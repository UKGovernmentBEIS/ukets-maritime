import { Pipe, PipeTransform } from '@angular/core';

import { UserInfoDTO } from '@mrtm/api';

import { userFullNameTransformer } from '@netz/common/utils';

@Pipe({ name: 'userFullName', pure: true, standalone: true })
export class UserFullNamePipe implements PipeTransform {
  transform(userDto: UserInfoDTO): string {
    return userFullNameTransformer(userDto);
  }
}
