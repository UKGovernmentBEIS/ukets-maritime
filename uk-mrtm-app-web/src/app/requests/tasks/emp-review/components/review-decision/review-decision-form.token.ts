import { InjectionToken } from '@angular/core';

import { ReviewDecisionFormModel } from '@requests/tasks/emp-review/components/review-decision/review-decision-form-model.type';

export const REVIEW_DECISION_FORM = new InjectionToken<ReviewDecisionFormModel>('Review decision form');
