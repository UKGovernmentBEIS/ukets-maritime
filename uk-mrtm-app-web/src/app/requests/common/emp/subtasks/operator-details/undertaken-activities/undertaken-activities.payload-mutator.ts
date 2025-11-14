import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { EmpOperatorDetails } from '@mrtm/api';

import { PayloadMutator } from '@netz/common/forms';

import { OPERATOR_DETAILS_SUB_TASK, OperatorDetailsWizardStep } from '@requests/common/components/operator-details';
import { EmpTaskPayload } from '@requests/common/emp/emp.types';
import { TaskItemStatus } from '@requests/common/task-item-status';

export class UndertakenActivitiesPayloadMutator extends PayloadMutator {
  subtask = OPERATOR_DETAILS_SUB_TASK;
  step = OperatorDetailsWizardStep.OPERATOR_DETAILS_UNDERTAKEN_ACTIVITIES;

  apply(currentPayload: EmpTaskPayload, userInput: Partial<EmpOperatorDetails>): Observable<EmpTaskPayload> {
    return of(
      produce(currentPayload, (payload) => {
        payload.emissionsMonitoringPlan[this.subtask] = {
          ...payload.emissionsMonitoringPlan[this.subtask],
          ...userInput,
        };
        payload.empSectionsCompleted[this.subtask] = TaskItemStatus.IN_PROGRESS;
      }),
    );
  }
}
