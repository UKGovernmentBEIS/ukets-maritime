import { Observable, of } from 'rxjs';

import { WizardFlowManager } from '@netz/common/forms';

import {
  FOLLOW_UP_RESPONSE_SUB_TASK,
  ResponseWizardStep,
} from '@requests/tasks/notification-follow-up-amend/subtasks/follow-up-response/response.helper';

export class ResponseFlowManager extends WizardFlowManager {
  subtask = FOLLOW_UP_RESPONSE_SUB_TASK;

  nextStepPath(currentStep: string): Observable<string> {
    switch (currentStep) {
      case ResponseWizardStep.FOLLOW_UP_RESPONSE:
        return of(ResponseWizardStep.SUMMARY);
      default:
        return of('../../');
    }
  }
}
