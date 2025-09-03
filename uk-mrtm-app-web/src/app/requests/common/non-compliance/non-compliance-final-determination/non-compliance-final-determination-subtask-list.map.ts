import { NonComplianceFinalDetermination } from '@mrtm/api';

import { SubTaskListMap } from '@shared/types';

export const nonComplianceFinalDeterminationDetailsMap: SubTaskListMap<NonComplianceFinalDetermination> = {
  title: 'Provide non-compliance conclusion',
  caption: 'Provide conclusion of non-compliance',
  complianceRestored: { title: 'Has compliance been restored?' },
  complianceRestoredDate: { title: 'When did the operator become compliant?' },
  comments: { title: 'Your comments on the status of compliance' },
  reissuePenalty: { title: 'Do you need to withdraw and reissue a penalty notice?' },
  operatorPaid: { title: 'Has the operator paid this penalty?' },
  operatorPaidDate: { title: 'When did the operator pay?' },
};
