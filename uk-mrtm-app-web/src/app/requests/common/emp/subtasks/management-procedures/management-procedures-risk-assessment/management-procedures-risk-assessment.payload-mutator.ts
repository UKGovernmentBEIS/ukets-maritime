import { inject } from '@angular/core';

import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { EmpProcedureFormWithFiles } from '@mrtm/api';

import { PayloadMutator } from '@netz/common/forms';

import { EmpTaskPayload } from '@requests/common/emp/emp.types';
import {
  MANAGEMENT_PROCEDURES_SUB_TASK,
  ManagementProceduresWizardStep,
} from '@requests/common/emp/subtasks/management-procedures';
import { SECTIONS_COMPLETE_MAP } from '@requests/common/section-completed-map.token';
import { TaskItemStatus } from '@requests/common/task-item-status';
import { UploadedFile } from '@shared/types';
import { createFileUploadPayload, transformToTaskAttachments } from '@shared/utils';

export class ManagementProceduresRiskAssessmentPayloadMutator extends PayloadMutator {
  private readonly sectionsCompletedMap = inject(SECTIONS_COMPLETE_MAP, { optional: true });
  subtask = MANAGEMENT_PROCEDURES_SUB_TASK;
  step = ManagementProceduresWizardStep.RISK_ASSESSMENT_PROCEDURES;

  /**
   * @param currentPayload
   * @param userInput The form value of each step
   */
  apply(
    currentPayload: EmpTaskPayload,
    userInput: Omit<EmpProcedureFormWithFiles, 'files'> & { files: UploadedFile[] },
  ): Observable<EmpTaskPayload> {
    return of(
      produce(currentPayload, (payload) => {
        payload.emissionsMonitoringPlan[this.subtask] = {
          ...payload.emissionsMonitoringPlan[this.subtask],
          riskAssessmentProcedures: {
            ...userInput,
            files: createFileUploadPayload(userInput.files),
          } as EmpProcedureFormWithFiles,
        };
        payload.empAttachments = {
          ...payload.empAttachments,
          ...transformToTaskAttachments(userInput.files),
        };
        payload.empSectionsCompleted[this.sectionsCompletedMap?.[this.subtask] ?? this.subtask] =
          TaskItemStatus.IN_PROGRESS;
      }),
    );
  }
}
