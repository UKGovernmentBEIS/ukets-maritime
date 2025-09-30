import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { Aer } from '@mrtm/api';

import { SideEffect, SubtaskOperation } from '@netz/common/forms';

import { AerSubmitTaskPayload } from '@requests/common/aer/aer.types';
import { REPORTING_OBLIGATION_SUB_TASK } from '@requests/common/aer/subtasks/reporting-obligation';
import {
  isOperatorDetailsCoreCompleted,
  OPERATOR_DETAILS_SUB_TASK,
} from '@requests/common/components/operator-details';
import { TaskItemStatus } from '@requests/common/task-item-status';

export class ReportingObligationSummarySideEffect extends SideEffect {
  step = null;
  readonly subtask = REPORTING_OBLIGATION_SUB_TASK;
  on: SubtaskOperation[] = ['SUBMIT_SUBTASK'];

  override apply(currentPayload: AerSubmitTaskPayload): Observable<AerSubmitTaskPayload> {
    return of(
      produce(currentPayload, (payload) => {
        if (currentPayload.reportingRequired) {
          if (!payload.aer?.[this.subtask]) {
            const empOperatorDetails = { ...payload.empOriginatedData?.operatorDetails };
            delete empOperatorDetails?.activityDescription;

            payload.aer = {
              ...(payload.aer ?? {}),
              [OPERATOR_DETAILS_SUB_TASK]: empOperatorDetails,
            } as Aer;

            payload.aerAttachments = {
              ...(payload.aerAttachments ?? {}),
              ...payload.empOriginatedData?.operatorDetailsAttachments,
            };

            if (isOperatorDetailsCoreCompleted(empOperatorDetails)) {
              payload.aerSectionsCompleted[OPERATOR_DETAILS_SUB_TASK] = TaskItemStatus.IN_PROGRESS;
            }
          }
          payload.aerSectionsCompleted[this.subtask] = TaskItemStatus.COMPLETED;
        } else {
          payload.aer = null;
          payload.aerSectionsCompleted = { [this.subtask]: TaskItemStatus.COMPLETED };
        }
      }),
    );
  }
}
