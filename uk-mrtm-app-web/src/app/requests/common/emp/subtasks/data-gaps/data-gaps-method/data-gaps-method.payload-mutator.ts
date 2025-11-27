import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { EmpDataGaps } from '@mrtm/api';

import { PayloadMutator } from '@netz/common/forms';

import { EmpTaskPayload } from '@requests/common/emp/emp.types';
import { DATA_GAPS_SUB_TASK, DataGapsWizardStep } from '@requests/common/emp/subtasks/data-gaps/data-gaps.helper';
import { TaskItemStatus } from '@requests/common/task-item-status';

export class DataGapsMethodPayloadMutator extends PayloadMutator {
  subtask = DATA_GAPS_SUB_TASK;
  step = DataGapsWizardStep.DATA_GAPS_METHOD;

  /**
   * @param currentPayload
   * @param userInput The form value of each step
   */
  apply(currentPayload: EmpTaskPayload, userInput: EmpDataGaps): Observable<EmpTaskPayload> {
    return of(
      produce(currentPayload, (payload) => {
        payload.emissionsMonitoringPlan[this.subtask] = userInput;
        payload.empSectionsCompleted[this.subtask] = TaskItemStatus.IN_PROGRESS;
      }),
    );
  }
}
