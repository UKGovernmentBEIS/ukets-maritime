import { OperatorInvitedUserInfoDTO, OperatorUserRegistrationDTO } from '@mrtm/api';

export interface UserRegistrationState {
  userRegistrationDTO?: Omit<OperatorUserRegistrationDTO, 'emailToken'>;
  email?: string;
  password?: string;
  token?: string;
  isSummarized?: boolean;
  isInvited?: boolean;
  invitationStatus?: OperatorInvitedUserInfoDTO['invitationStatus'];
  emailVerificationStatus?: 'REGISTERED' | 'NOT_REGISTERED';
}

export const initialState: UserRegistrationState = {
  userRegistrationDTO: null,
  email: null,
  password: null,
  token: null,
  isSummarized: false,
  isInvited: false,
  invitationStatus: null,
  emailVerificationStatus: null,
};
