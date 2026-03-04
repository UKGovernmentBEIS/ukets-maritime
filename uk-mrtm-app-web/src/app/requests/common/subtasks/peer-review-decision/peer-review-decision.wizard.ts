import { PeerReviewDecision } from '@mrtm/api';

import { isNil } from '@shared/utils';

export const isPeerReviewWizardCompleted = (decision: PeerReviewDecision) =>
  !isNil(decision?.type) && !isNil(decision?.notes);
