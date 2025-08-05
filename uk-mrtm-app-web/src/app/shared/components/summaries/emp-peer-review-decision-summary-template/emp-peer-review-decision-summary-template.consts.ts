import { EmpPeerReviewDecisionDto } from '@shared/types';

export const determinationTypeMap: Record<EmpPeerReviewDecisionDto['type'], string> = {
  AGREE: 'I agree with the determination',
  DISAGREE: 'I do not agree with the determination',
};
