import { UserAuthorityInfoDTO, VerificationBodyCreationDTO, VerificationBodyDTO } from '@mrtm/api';

import { SubmissionError } from '@shared/types';

interface EditableListState<T> {
  items: T[] | null;
  editable: boolean;
}

export interface VerificationBodiesCreateState {
  newVerificationBody: VerificationBodyCreationDTO | null;
  submissionErrors: SubmissionError[] | null;
  isInitiallySubmitted: boolean;
  isSubmitted: boolean;
}

export interface VerificationBodiesUpdateState {
  verificationBody: VerificationBodyDTO | null;
  submissionErrors: SubmissionError[] | null;
  isSubmitted: boolean;
}

export type VerificationBodiesListState = EditableListState<VerificationBodyDTO>;

export type VerificationBodyContactsState = EditableListState<UserAuthorityInfoDTO>;

export interface VerificationBodiesState {
  createVerificationBody: VerificationBodiesCreateState;
  verificationBodiesList: VerificationBodiesListState;
  currentVerificationBody: VerificationBodiesUpdateState;
  verificationBodyContacts: VerificationBodyContactsState;
}

export const initialVerificationBodyCreationState: VerificationBodiesCreateState = {
  newVerificationBody: null,
  submissionErrors: null,
  isInitiallySubmitted: false,
  isSubmitted: false,
};

export const initialVerificationBodiesListState: VerificationBodiesListState = {
  items: null,
  editable: false,
};

export const initialVerificationBodyContactsState: VerificationBodyContactsState = {
  items: null,
  editable: false,
};

export const initialVerificationBodiesUpdateState: VerificationBodiesUpdateState = {
  verificationBody: null,
  submissionErrors: null,
  isSubmitted: false,
};

export const initialVerificationBodiesState: VerificationBodiesState = {
  createVerificationBody: initialVerificationBodyCreationState,
  verificationBodiesList: initialVerificationBodiesListState,
  currentVerificationBody: initialVerificationBodiesUpdateState,
  verificationBodyContacts: initialVerificationBodyContactsState,
};
