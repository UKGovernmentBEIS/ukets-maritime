import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { OrganisationStructure } from '@mrtm/api';

import { PayloadMutator } from '@netz/common/forms';

import { OPERATOR_DETAILS_SUB_TASK, OperatorDetailsWizardStep } from '@requests/common/components/operator-details';
import { EmpTaskPayload } from '@requests/common/emp/emp.types';
import { TaskItemStatus } from '@requests/common/task-item-status';

export class LegalStatusOfOrganisationPayloadMutator extends PayloadMutator {
  subtask = OPERATOR_DETAILS_SUB_TASK;
  step = OperatorDetailsWizardStep.OPERATOR_DETAILS_LEGAL_STATUS_OF_ORGANISATION;

  apply(
    currentPayload: EmpTaskPayload,
    userInput: Pick<OrganisationStructure, 'legalStatusType'>,
  ): Observable<EmpTaskPayload> {
    return of(
      produce(currentPayload, (payload) => {
        const currentLegalStatusType =
          payload.emissionsMonitoringPlan[this.subtask]['organisationStructure']?.legalStatusType;
        const newLegalStatusType = userInput.legalStatusType;

        if (currentLegalStatusType !== newLegalStatusType) {
          payload.emissionsMonitoringPlan[this.subtask]['organisationStructure'] = { ...userInput };
        }
        payload.empSectionsCompleted[this.subtask] = TaskItemStatus.IN_PROGRESS;
      }),
    );
  }
}
