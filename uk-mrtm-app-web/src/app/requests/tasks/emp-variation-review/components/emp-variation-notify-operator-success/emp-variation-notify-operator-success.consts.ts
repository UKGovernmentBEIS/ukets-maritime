import { EmpVariationDetermination } from '@mrtm/api';

export const empVariationNotifyOperatorStatusMap: Record<EmpVariationDetermination['type'], string> = {
  APPROVED: 'approved',
  REJECTED: 'rejected',
  DEEMED_WITHDRAWN: 'withdrawn',
};
