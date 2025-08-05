import { Observable, of } from 'rxjs';

import { WizardFlowManager } from '@netz/common/forms';

import {
  FOLLOW_UP_RESPONSE_SUB_TASK,
  FollowUpResponseWizardStep,
} from '@requests/tasks/notification-follow-up/subtasks/follow-up-response/follow-up-response.helper';

export class FollowUpResponseFlowManager extends WizardFlowManager {
  override subtask = FOLLOW_UP_RESPONSE_SUB_TASK;

  nextStepPath(currentStep: string): Observable<string> {
    switch (currentStep) {
      case FollowUpResponseWizardStep.FOLLOW_UP_RESPONSE:
        return of(FollowUpResponseWizardStep.SUMMARY);
      default:
        return of('../../');
    }
  }
}
