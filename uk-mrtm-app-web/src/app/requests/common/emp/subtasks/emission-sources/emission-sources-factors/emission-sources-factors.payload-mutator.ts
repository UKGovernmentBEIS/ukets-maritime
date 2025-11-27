import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { EmpEmissionFactors } from '@mrtm/api';

import { PayloadMutator } from '@netz/common/forms';

import { EmpTaskPayload } from '@requests/common/emp/emp.types';
import { EMISSION_SOURCES_SUB_TASK, EmissionSourcesWizardStep } from '@requests/common/emp/subtasks/emission-sources';
import { TaskItemStatus } from '@requests/common/task-item-status';

export class EmissionSourcesFactorsPayloadMutator extends PayloadMutator {
  subtask = EMISSION_SOURCES_SUB_TASK;
  step = EmissionSourcesWizardStep.EMISSION_FACTORS;

  apply(currentPayload: EmpTaskPayload, userInput: EmpEmissionFactors): Observable<EmpTaskPayload> {
    return of(
      produce(currentPayload, (payload: EmpTaskPayload) => {
        payload.emissionsMonitoringPlan[this.subtask] = {
          ...payload.emissionsMonitoringPlan[this.subtask],
          emissionFactors: {
            ...userInput,
          },
        };
        payload.empSectionsCompleted[this.subtask] = TaskItemStatus.IN_PROGRESS;
      }),
    );
  }
}
