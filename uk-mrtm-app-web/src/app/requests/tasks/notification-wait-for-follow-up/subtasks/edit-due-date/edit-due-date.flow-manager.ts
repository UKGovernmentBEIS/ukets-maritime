import { Observable, of } from 'rxjs';

import { WizardFlowManager } from '@netz/common/forms';

import { EDIT_DUE_DATE_SUB_TASK } from '@requests/tasks/notification-wait-for-follow-up/subtasks/edit-due-date/edit-due-date.helper';

export class EditDueDateFlowManager extends WizardFlowManager {
  subtask = EDIT_DUE_DATE_SUB_TASK;

  nextStepPath(): Observable<string> {
    return of('../../');
  }
}
