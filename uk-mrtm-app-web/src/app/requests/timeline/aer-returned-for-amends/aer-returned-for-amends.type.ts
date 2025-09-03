import { AerApplicationReturnedForAmendsRequestActionPayload } from '@mrtm/api';

import { ReviewDecisionUnion } from '@shared/types';

export type AerReturnedForAmendsActionPayload = Omit<
  AerApplicationReturnedForAmendsRequestActionPayload,
  'reviewGroupDecisions'
> & {
  reviewGroupDecisions: { [key: string]: ReviewDecisionUnion };
};
