import { map, OperatorFunction, pipe } from 'rxjs';

import { OperatorUserInvitationDTO, UserAuthorityInfoDTO, VerifierUserDTO } from '@mrtm/api';

import { SubmissionError } from '@shared/types';
import {
  CreateVerifierUserState,
  VerifierUsersListState,
  VerifierUserState,
} from '@verifiers/+state/verifier-user.state';

export const selectCreateUserAuthorityState: OperatorFunction<VerifierUserState, CreateVerifierUserState> = pipe(
  map((state) => state.createVerifierUser),
);

export const selectVerifierUsersListState: OperatorFunction<VerifierUserState, VerifierUsersListState> = pipe(
  map((state) => state.verifierUsersList),
);

export const selectNewUserAuthority: OperatorFunction<VerifierUserState, OperatorUserInvitationDTO> = pipe(
  selectCreateUserAuthorityState,
  map((state) => state.newUserAuthority),
);

export const selectIsInitiallySubmitted: OperatorFunction<VerifierUserState, boolean> = pipe(
  selectCreateUserAuthorityState,
  map((state) => state.isInitiallySubmitted),
);

export const selectIsSubmitted: OperatorFunction<VerifierUserState, boolean> = pipe(
  selectCreateUserAuthorityState,
  map((state) => state.isSubmitted),
);

export const selectUserAuthority: OperatorFunction<VerifierUserState, VerifierUserDTO> = pipe(
  map((state) => state.currentVerifierUser),
);

export const selectSubmissionErrors: OperatorFunction<VerifierUserState, SubmissionError[]> = pipe(
  map((state) => state.createVerifierUser.submissionErrors),
);

export const selectIsEditableVerifierUsersList: OperatorFunction<VerifierUserState, boolean> = pipe(
  selectVerifierUsersListState,
  map((state) => state.editable),
);

export const selectVerifierUsersListItems: OperatorFunction<VerifierUserState, UserAuthorityInfoDTO[]> = pipe(
  selectVerifierUsersListState,
  map((state) => state.items),
);
