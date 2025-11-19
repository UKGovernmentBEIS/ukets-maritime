import { inject } from '@angular/core';

import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { EmpProcedureForm } from '@mrtm/api';

import { PayloadMutator } from '@netz/common/forms';

import { EmpTaskPayload } from '@requests/common/emp/emp.types';
import { GREENHOUSE_GAS_SUB_TASK, GreenhouseGasWizardStep } from '@requests/common/emp/subtasks/greenhouse-gas';
import { SECTIONS_COMPLETE_MAP } from '@requests/common/section-completed-map.token';
import { TaskItemStatus } from '@requests/common/task-item-status';

export class GreenhouseGasVoyagesPayloadMutator extends PayloadMutator {
  private readonly sectionsCompletedMap = inject(SECTIONS_COMPLETE_MAP, { optional: true });
  subtask = GREENHOUSE_GAS_SUB_TASK;
  step = GreenhouseGasWizardStep.VOYAGES;

  apply(currentPayload: EmpTaskPayload, userInput: EmpProcedureForm): Observable<EmpTaskPayload> {
    return of(
      produce(currentPayload, (payload: EmpTaskPayload) => {
        payload.emissionsMonitoringPlan[this.subtask] = {
          ...payload.emissionsMonitoringPlan[this.subtask],
          voyages: {
            ...userInput,
          },
        };
        payload.empSectionsCompleted[this.sectionsCompletedMap?.[this.subtask] ?? this.subtask] =
          TaskItemStatus.IN_PROGRESS;
      }),
    );
  }
}
