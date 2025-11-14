import { VirVerificationData } from '@mrtm/api';

import { SubTaskListMap } from '@shared/types';

const uncorrectedNonConformitiesFromThePreviousYearTitle = 'Uncorrected non-conformities from the previous year';
const recommendedImprovementTitle = 'Recommended improvement';
const uncorrectedNonConformitiesTitle = 'Uncorrected non-conformities';

export const virSubtaskList: SubTaskListMap<
  VirVerificationData & { sendReport: unknown; B1: string; D1: string; E1: string }
> = {
  title: 'Annual verifier improvement report',
  priorYearIssues: {
    title: uncorrectedNonConformitiesFromThePreviousYearTitle,
  },
  recommendedImprovements: {
    title: recommendedImprovementTitle,
  },
  uncorrectedNonConformities: {
    title: uncorrectedNonConformitiesTitle,
  },
  sendReport: {
    title: 'Send report',
  },
  B1: {
    title: uncorrectedNonConformitiesFromThePreviousYearTitle,
  },
  D1: {
    title: recommendedImprovementTitle,
  },
  E1: {
    title: uncorrectedNonConformitiesTitle,
  },
};
