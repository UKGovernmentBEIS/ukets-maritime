import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { PayloadMutator } from '@netz/common/forms';

import { EDIT_DUE_DATE_SUB_TASK } from '@requests/tasks/notification-wait-for-amends/subtasks/edit-due-date/edit-due-date.helper';
import { WaitForAmendsTaskPayload } from '@requests/tasks/notification-wait-for-amends/wait-for-amends.types';

export class EditDueDatePayloadMutator extends PayloadMutator {
  subtask = EDIT_DUE_DATE_SUB_TASK;
  step = null;

  /**
   * @param currentPayload
   * @param userInput The form value of each step
   */
  apply(currentPayload: WaitForAmendsTaskPayload, userInput: Date): Observable<any> {
    return of(
      produce(currentPayload, (payload) => {
        payload.reviewDecision.details['dueDate'] = userInput;
      }),
    );
  }
}
