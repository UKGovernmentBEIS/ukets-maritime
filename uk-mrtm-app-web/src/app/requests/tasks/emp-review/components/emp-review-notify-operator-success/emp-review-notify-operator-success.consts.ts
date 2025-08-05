import { EmpIssuanceDetermination } from '@mrtm/api';

export const empReviewNotifyOperatorStatusMap: Record<EmpIssuanceDetermination['type'], string> = {
  APPROVED: 'approved',
  DEEMED_WITHDRAWN: 'withdrawn',
};
