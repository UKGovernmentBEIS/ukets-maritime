import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { EmpProcedureForm } from '@mrtm/api';

import { PayloadMutator } from '@netz/common/forms';

import { EmpTaskPayload } from '@requests/common/emp/emp.types';
import {
  MANAGEMENT_PROCEDURES_SUB_TASK,
  ManagementProceduresWizardStep,
} from '@requests/common/emp/subtasks/management-procedures';
import { TaskItemStatus } from '@requests/common/task-item-status';

export class ManagementProceduresAdequacyPayloadMutator extends PayloadMutator {
  subtask = MANAGEMENT_PROCEDURES_SUB_TASK;
  step = ManagementProceduresWizardStep.REGULAR_CHECK_OF_ADEQUACY;

  /**
   * @param currentPayload
   * @param userInput The form value of each step
   */
  apply(currentPayload: EmpTaskPayload, userInput: EmpProcedureForm): Observable<EmpTaskPayload> {
    return of(
      produce(currentPayload, (payload) => {
        payload.emissionsMonitoringPlan[this.subtask] = {
          ...payload.emissionsMonitoringPlan[this.subtask],
          regularCheckOfAdequacy: userInput,
        };
        payload.empSectionsCompleted[this.subtask] = TaskItemStatus.IN_PROGRESS;
      }),
    );
  }
}
