import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { PayloadMutator } from '@netz/common/forms';

import { EDIT_DUE_DATE_SUB_TASK } from '@requests/tasks/notification-wait-for-follow-up/subtasks/edit-due-date/edit-due-date.helper';
import { WaitForFollowUpTaskPayload } from '@requests/tasks/notification-wait-for-follow-up/wait-for-follow-up.types';

export class EditDueDatePayloadMutator extends PayloadMutator {
  subtask = EDIT_DUE_DATE_SUB_TASK;
  step = null;

  /**
   * @param currentPayload
   * @param userInput The form value of each step
   */
  apply(currentPayload: WaitForFollowUpTaskPayload, userInput: Date): Observable<any> {
    return of(
      produce(currentPayload, (payload) => {
        payload.followUpResponseExpirationDate = userInput.toISOString();
      }),
    );
  }
}
