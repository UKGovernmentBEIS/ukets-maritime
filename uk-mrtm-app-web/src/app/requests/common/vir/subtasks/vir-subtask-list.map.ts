import { VirVerificationData } from '@mrtm/api';

import { SubTaskListMap } from '@shared/types';

export const virSubtaskList: SubTaskListMap<VirVerificationData & { sendReport: unknown }> = {
  title: 'Annual verifier improvement report',
  priorYearIssues: {
    title: 'Uncorrected non-conformities from the previous year',
  },
  recommendedImprovements: {
    title: 'Recommended improvement',
  },
  uncorrectedNonConformities: {
    title: 'Uncorrected non-conformities',
  },
  sendReport: {
    title: 'Send report',
  },
};
