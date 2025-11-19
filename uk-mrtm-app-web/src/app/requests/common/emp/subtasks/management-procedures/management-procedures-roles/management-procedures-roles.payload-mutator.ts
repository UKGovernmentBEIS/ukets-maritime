import { inject } from '@angular/core';

import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { EmpManagementProcedures } from '@mrtm/api';

import { PayloadMutator } from '@netz/common/forms';

import { EmpTaskPayload } from '@requests/common/emp/emp.types';
import {
  MANAGEMENT_PROCEDURES_SUB_TASK,
  ManagementProceduresWizardStep,
} from '@requests/common/emp/subtasks/management-procedures';
import { SECTIONS_COMPLETE_MAP } from '@requests/common/section-completed-map.token';
import { TaskItemStatus } from '@requests/common/task-item-status';

export class ManagementProceduresRolesPayloadMutator extends PayloadMutator {
  private readonly sectionsCompletedMap = inject(SECTIONS_COMPLETE_MAP, { optional: true });
  subtask = MANAGEMENT_PROCEDURES_SUB_TASK;
  step = ManagementProceduresWizardStep.MONITORING_REPORTING_ROLES;

  /**
   * @param currentPayload
   * @param userInput The form value of each step
   */
  apply(
    currentPayload: EmpTaskPayload,
    userInput: Pick<EmpManagementProcedures, 'monitoringReportingRoles'>,
  ): Observable<EmpTaskPayload> {
    return of(
      produce(currentPayload, (payload) => {
        payload.emissionsMonitoringPlan[this.subtask] = {
          ...payload.emissionsMonitoringPlan[this.subtask],
          ...userInput,
        };
        payload.empSectionsCompleted[this.sectionsCompletedMap?.[this.subtask] ?? this.subtask] =
          TaskItemStatus.IN_PROGRESS;
      }),
    );
  }
}
