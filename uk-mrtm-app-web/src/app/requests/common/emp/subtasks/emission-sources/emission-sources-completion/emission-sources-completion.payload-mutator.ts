import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { EmpProcedureForm } from '@mrtm/api';

import { PayloadMutator } from '@netz/common/forms';

import { EmpTaskPayload } from '@requests/common/emp/emp.types';
import { EMISSION_SOURCES_SUB_TASK, EmissionSourcesWizardStep } from '@requests/common/emp/subtasks/emission-sources';
import { TaskItemStatus } from '@requests/common/task-item-status';

export class EmissionSourcesCompletionPayloadMutator extends PayloadMutator {
  subtask = EMISSION_SOURCES_SUB_TASK;
  step = EmissionSourcesWizardStep.LIST_COMPLETION;

  apply(currentPayload: EmpTaskPayload, userInput: EmpProcedureForm): Observable<EmpTaskPayload> {
    return of(
      produce(currentPayload, (payload: EmpTaskPayload) => {
        payload.emissionsMonitoringPlan[this.subtask] = {
          ...payload.emissionsMonitoringPlan[this.subtask],
          listCompletion: {
            ...userInput,
          },
        };
        payload.empSectionsCompleted[this.subtask] = TaskItemStatus.IN_PROGRESS;
      }),
    );
  }
}
