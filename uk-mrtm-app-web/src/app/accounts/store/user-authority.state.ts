import { OperatorUserInvitationDTO, OperatorUserStatusDTO } from '@mrtm/api';

import { SubmissionError } from '@shared/types';

export interface CreateUserAuthorityState {
  newUserAuthority: OperatorUserInvitationDTO;
  isInitiallySubmitted: boolean;
  isSubmitted: boolean;
  submissionErrors: SubmissionError[];
}

export interface UserAuthorityState {
  createUserAuthority: CreateUserAuthorityState;
  currentUserAuthority: OperatorUserStatusDTO;
}

export const initialCreateUserAuthorityState: CreateUserAuthorityState = {
  newUserAuthority: null,
  isInitiallySubmitted: false,
  isSubmitted: false,
  submissionErrors: [],
};

export const userAuthorityInitialState: UserAuthorityState = {
  createUserAuthority: initialCreateUserAuthorityState,
  currentUserAuthority: null,
};
