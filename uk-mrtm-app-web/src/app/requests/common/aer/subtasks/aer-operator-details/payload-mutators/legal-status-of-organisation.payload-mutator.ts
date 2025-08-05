import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { OrganisationStructure } from '@mrtm/api';

import { PayloadMutator } from '@netz/common/forms';

import { AerSubmitTaskPayload } from '@requests/common/aer/aer.types';
import { OPERATOR_DETAILS_SUB_TASK, OperatorDetailsWizardStep } from '@requests/common/components/operator-details';
import { TaskItemStatus } from '@requests/common/task-item-status';

export class AerLegalStatusOfOrganisationPayloadMutator extends PayloadMutator {
  readonly subtask = OPERATOR_DETAILS_SUB_TASK;
  step = OperatorDetailsWizardStep.OPERATOR_DETAILS_LEGAL_STATUS_OF_ORGANISATION;

  apply(
    currentPayload: AerSubmitTaskPayload,
    userInput: Pick<OrganisationStructure, 'legalStatusType'>,
  ): Observable<AerSubmitTaskPayload> {
    return of(
      produce(currentPayload, (payload) => {
        const currentLegalStatusType = payload.aer[this.subtask]['organisationStructure']?.legalStatusType;
        const newLegalStatusType = userInput.legalStatusType;

        if (currentLegalStatusType !== newLegalStatusType) {
          payload.aer[this.subtask].organisationStructure = { ...userInput } as OrganisationStructure;
        }
        payload.aerSectionsCompleted[this.subtask] = TaskItemStatus.IN_PROGRESS;
      }),
    );
  }
}
