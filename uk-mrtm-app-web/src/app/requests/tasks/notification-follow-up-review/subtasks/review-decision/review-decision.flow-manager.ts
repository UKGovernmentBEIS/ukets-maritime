import { Observable, of } from 'rxjs';

import { WizardFlowManager } from '@netz/common/forms';

import {
  REVIEW_DECISION_SUB_TASK,
  ReviewDecisionWizardStep,
} from '@requests/tasks/notification-follow-up-review/subtasks/review-decision';

export class ReviewDecisionFlowManager extends WizardFlowManager {
  override subtask = REVIEW_DECISION_SUB_TASK;

  nextStepPath(currentStep: string): Observable<string> {
    switch (currentStep) {
      case ReviewDecisionWizardStep.REVIEW_DECISION_QUESTION:
        return of(ReviewDecisionWizardStep.SUMMARY);

      default:
        return of('../../');
    }
  }
}
