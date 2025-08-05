import { UserInfoDTO } from '@mrtm/api';

export const userFullNameTransformer = (userDto: UserInfoDTO): string =>
  userDto.firstName ? `${userDto.firstName} ${userDto.lastName}` : `${userDto.lastName}`;
