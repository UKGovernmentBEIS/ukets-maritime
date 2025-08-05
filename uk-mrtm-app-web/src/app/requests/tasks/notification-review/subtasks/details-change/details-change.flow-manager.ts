import { Observable, of } from 'rxjs';

import { WizardFlowManager } from '@netz/common/forms';

import {
  DETAILS_CHANGE_SUB_TASK,
  DetailsChangeWizardStep,
} from '@requests/tasks/notification-review/subtasks/details-change';

export class DetailsChangeFlowManager extends WizardFlowManager {
  override subtask = DETAILS_CHANGE_SUB_TASK;

  nextStepPath(currentStep: string): Observable<string> {
    switch (currentStep) {
      case DetailsChangeWizardStep.REVIEW_DECISION:
        return of(DetailsChangeWizardStep.SUMMARY);

      default:
        return of('../../');
    }
  }
}
