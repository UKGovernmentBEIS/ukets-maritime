import { isNil } from 'lodash-es';

import { PeerReviewDecision } from '@mrtm/api';

export const isPeerReviewWizardCompleted = (decision: PeerReviewDecision) =>
  !isNil(decision?.type) && !isNil(decision?.notes);
