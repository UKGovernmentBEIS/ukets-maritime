import { MrtmRequestActionType, MrtmRequestTaskType } from '@shared/types';

const doeTypesList: Array<MrtmRequestTaskType | MrtmRequestActionType> = [
  'DOE',
  'DOE_APPLICATION_PEER_REVIEW',
  'DOE_WAIT_FOR_PEER_REVIEW',
  'DOE_APPLICATION_SUBMIT',
  'DOE_PEER_REVIEW_REQUESTED',
  'DOE_PEER_REVIEWER_ACCEPTED',
  'DOE_PEER_REVIEWER_REJECTED',
  'DOE_APPLICATION_CANCELLED',
  'DOE_APPLICATION_SUBMITTED',
  'DOE_MAKE_PAYMENT',
  'DOE_CONFIRM_PAYMENT',
  'DOE_TRACK_PAYMENT',
  'DOE_APPLICATION_CANCELLED_DUE_TO_EXEMPT',
];

export const isDoe = (type: MrtmRequestTaskType | MrtmRequestActionType): boolean => {
  return doeTypesList.includes(type);
};
