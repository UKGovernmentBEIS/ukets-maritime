import { map, OperatorFunction, pipe } from 'rxjs';

import { UserAuthorityInfoDTO, VerificationBodyCreationDTO, VerificationBodyDTO } from '@mrtm/api';

import { SubmissionError } from '@shared/types';
import {
  VerificationBodiesCreateState,
  VerificationBodiesListState,
  VerificationBodiesState,
  VerificationBodiesUpdateState,
  VerificationBodyContactsState,
} from '@verification-bodies/+state/verification-bodies.state';

export const selectCreateVerificationBodyState: OperatorFunction<
  VerificationBodiesState,
  VerificationBodiesCreateState
> = pipe(map((state) => state.createVerificationBody));

export const selectVerificationBodiesListState: OperatorFunction<VerificationBodiesState, VerificationBodiesListState> =
  pipe(map((state) => state.verificationBodiesList));

export const selectVerificationBodyUpdateState: OperatorFunction<
  VerificationBodiesState,
  VerificationBodiesUpdateState
> = pipe(map((state) => state.currentVerificationBody));

export const selectVerificationBodyContactsState: OperatorFunction<
  VerificationBodiesState,
  VerificationBodyContactsState
> = pipe(map((state) => state.verificationBodyContacts));

export const selectNewVerificationBody: OperatorFunction<VerificationBodiesState, VerificationBodyCreationDTO> = pipe(
  selectCreateVerificationBodyState,
  map((state) => state.newVerificationBody),
);

export const selectIsInitiallySubmitted: OperatorFunction<VerificationBodiesState, boolean> = pipe(
  selectCreateVerificationBodyState,
  map((state) => state.isInitiallySubmitted),
);

export const selectIsSubmitted: OperatorFunction<VerificationBodiesState, boolean> = pipe(
  selectCreateVerificationBodyState,
  map((state) => state.isSubmitted),
);

export const selectSubmissionErrors: OperatorFunction<VerificationBodiesState, SubmissionError[] | null> = pipe(
  selectCreateVerificationBodyState,
  map((state) => state.submissionErrors),
);

export const selectIsEditableVerificationBodiesList: OperatorFunction<VerificationBodiesState, boolean> = pipe(
  selectVerificationBodiesListState,
  map((state) => state.editable),
);

export const selectVerificationBodiesListItems: OperatorFunction<VerificationBodiesState, VerificationBodyDTO[]> = pipe(
  selectVerificationBodiesListState,
  map((state) => state.items),
);

export const selectCurrentVerificationBody: OperatorFunction<VerificationBodiesState, VerificationBodyDTO> = pipe(
  selectVerificationBodyUpdateState,
  map((state) => state.verificationBody),
);

export const selectIsVerificationBodySubmitted: OperatorFunction<VerificationBodiesState, boolean> = pipe(
  selectVerificationBodyUpdateState,
  map((state) => state.isSubmitted),
);

export const selectVerificationBodyContactsList: OperatorFunction<VerificationBodiesState, UserAuthorityInfoDTO[]> =
  pipe(
    selectVerificationBodyContactsState,
    map((state) => state.items),
  );

export const selectIsEditableVerificationBodyContacts: OperatorFunction<VerificationBodiesState, boolean> = pipe(
  selectVerificationBodyContactsState,
  map((state) => state.editable),
);
