import { map, OperatorFunction, pipe } from 'rxjs';

import { OperatorUserInvitationDTO, OperatorUserStatusDTO } from '@mrtm/api';

import { CreateUserAuthorityState, UserAuthorityState } from '@accounts/store/user-authority.state';
import { SubmissionError } from '@shared/types';

export const selectCreateUserAuthorityState: OperatorFunction<UserAuthorityState, CreateUserAuthorityState> = pipe(
  map((state) => state.createUserAuthority),
);

export const selectNewUserAuthority: OperatorFunction<UserAuthorityState, OperatorUserInvitationDTO> = pipe(
  selectCreateUserAuthorityState,
  map((state) => state.newUserAuthority),
);

export const selectIsInitiallySubmitted: OperatorFunction<UserAuthorityState, boolean> = pipe(
  selectCreateUserAuthorityState,
  map((state) => state.isInitiallySubmitted),
);

export const selectIsSubmitted: OperatorFunction<UserAuthorityState, boolean> = pipe(
  selectCreateUserAuthorityState,
  map((state) => state.isSubmitted),
);

export const selectUserAuthority: OperatorFunction<UserAuthorityState, OperatorUserStatusDTO> = pipe(
  map((state) => state.currentUserAuthority),
);

export const selectSubmissionErrors: OperatorFunction<UserAuthorityState, SubmissionError[]> = pipe(
  map((state) => state.createUserAuthority.submissionErrors),
);
