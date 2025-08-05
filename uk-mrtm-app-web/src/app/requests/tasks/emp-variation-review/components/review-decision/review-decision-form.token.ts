import { InjectionToken } from '@angular/core';

import { ReviewDecisionFormModel } from '@requests/tasks/emp-variation-review/components/review-decision/review-decision-form-model.type';

export const VARIATION_REVIEW_DECISION_FORM = new InjectionToken<ReviewDecisionFormModel>(
  'Variation review decision form',
);
