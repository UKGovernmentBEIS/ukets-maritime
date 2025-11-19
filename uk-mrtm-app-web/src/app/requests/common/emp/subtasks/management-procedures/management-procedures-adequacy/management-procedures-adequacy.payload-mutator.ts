import { inject } from '@angular/core';

import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { EmpProcedureForm } from '@mrtm/api';

import { PayloadMutator } from '@netz/common/forms';

import { EmpTaskPayload } from '@requests/common/emp/emp.types';
import {
  MANAGEMENT_PROCEDURES_SUB_TASK,
  ManagementProceduresWizardStep,
} from '@requests/common/emp/subtasks/management-procedures';
import { SECTIONS_COMPLETE_MAP } from '@requests/common/section-completed-map.token';
import { TaskItemStatus } from '@requests/common/task-item-status';

export class ManagementProceduresAdequacyPayloadMutator extends PayloadMutator {
  private readonly sectionsCompletedMap = inject(SECTIONS_COMPLETE_MAP, { optional: true });
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
        payload.empSectionsCompleted[this.sectionsCompletedMap?.[this.subtask] ?? this.subtask] =
          TaskItemStatus.IN_PROGRESS;
      }),
    );
  }
}
