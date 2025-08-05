import { inject } from '@angular/core';

import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { EmpOperatorDetails } from '@mrtm/api';

import { PayloadMutator } from '@netz/common/forms';

import { OPERATOR_DETAILS_SUB_TASK, OperatorDetailsWizardStep } from '@requests/common/components/operator-details';
import { EmpTaskPayload } from '@requests/common/emp/emp.types';
import { SECTIONS_COMPLETE_MAP } from '@requests/common/section-completed-map.token';
import { TaskItemStatus } from '@requests/common/task-item-status';

export class OperatorDetailsStepPayloadMutator extends PayloadMutator {
  private readonly sectionsCompletedMap = inject(SECTIONS_COMPLETE_MAP, { optional: true });
  subtask = OPERATOR_DETAILS_SUB_TASK;
  step = OperatorDetailsWizardStep.OPERATOR_DETAILS_OPERATOR_FORM;

  apply(currentPayload: EmpTaskPayload, userInput: Partial<EmpOperatorDetails>): Observable<EmpTaskPayload> {
    return of(
      produce(currentPayload, (payload) => {
        payload.emissionsMonitoringPlan[this.subtask] = {
          ...payload.emissionsMonitoringPlan[this.subtask],
          ...userInput,
        };

        if (payload?.emissionsMonitoringPlan?.[this.subtask]?.organisationStructure?.sameAsContactAddress === true) {
          payload.emissionsMonitoringPlan[this.subtask].organisationStructure = {
            ...(payload?.emissionsMonitoringPlan?.[this.subtask]?.organisationStructure ?? {}),
            registeredAddress: payload?.emissionsMonitoringPlan?.[this.subtask]?.organisationStructure
              ?.sameAsContactAddress
              ? userInput?.contactAddress
              : (payload?.emissionsMonitoringPlan?.[this.subtask]?.organisationStructure?.registeredAddress ?? {}),
          };
        }

        payload.empSectionsCompleted[this.sectionsCompletedMap?.[this.subtask] ?? this.subtask] =
          TaskItemStatus.IN_PROGRESS;
      }),
    );
  }
}
