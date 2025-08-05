import { Observable, of } from 'rxjs';

import { WizardFlowManager } from '@netz/common/forms';

import { AMENDS_DETAILS_SUB_TASK } from '@requests/tasks/notification-follow-up-amend/subtasks/amends-details/amends-details.helper';

export class AmendsDetailsFlowManager extends WizardFlowManager {
  subtask = AMENDS_DETAILS_SUB_TASK;

  nextStepPath(): Observable<string> {
    return of('../../');
  }
}
