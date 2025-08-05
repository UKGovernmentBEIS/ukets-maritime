import { MrtmRequestActionType, MrtmRequestTaskType } from '@shared/types';

const virTypesList: Array<MrtmRequestTaskType | MrtmRequestActionType> = [
  'VIR',
  'VIR_APPLICATION_SUBMIT',
  'VIR_APPLICATION_REVIEW',
  'VIR_RESPOND_TO_REGULATOR_COMMENTS',
  'VIR_WAIT_FOR_REVIEW',
  'VIR_APPLICATION_SUBMITTED',
];

export const isVir = (type: MrtmRequestTaskType | MrtmRequestActionType): boolean => {
  return virTypesList.includes(type);
};
