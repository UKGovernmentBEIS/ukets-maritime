import { UserAuthorityInfoDTO, VerifierUserDTO, VerifierUserInvitationDTO } from '@mrtm/api';

import { SubmissionError } from '@shared/types';

export interface CreateVerifierUserState {
  newUserAuthority: VerifierUserInvitationDTO;
  isInitiallySubmitted: boolean;
  isSubmitted: boolean;
  submissionErrors: SubmissionError[];
}

export interface VerifierUsersListState {
  items: UserAuthorityInfoDTO[] | null;
  editable: boolean;
}

export interface VerifierUserState {
  createVerifierUser: CreateVerifierUserState;
  currentVerifierUser: VerifierUserDTO;
  verifierUsersList: VerifierUsersListState;
}

export const initialCreateUserAuthorityState: CreateVerifierUserState = {
  newUserAuthority: null,
  isInitiallySubmitted: false,
  isSubmitted: false,
  submissionErrors: [],
};

export const initialVerifierUsersListState: VerifierUsersListState = {
  items: null,
  editable: false,
};

export const userAuthorityInitialState: VerifierUserState = {
  createVerifierUser: initialCreateUserAuthorityState,
  currentVerifierUser: null,
  verifierUsersList: initialVerifierUsersListState,
};
