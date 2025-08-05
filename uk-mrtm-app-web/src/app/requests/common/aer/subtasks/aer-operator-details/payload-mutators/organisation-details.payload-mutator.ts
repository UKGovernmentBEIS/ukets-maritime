import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { OrganisationStructure, PartnershipOrganisation } from '@mrtm/api';

import { PayloadMutator } from '@netz/common/forms';

import { AerSubmitTaskPayload } from '@requests/common/aer/aer.types';
import { OPERATOR_DETAILS_SUB_TASK, OperatorDetailsWizardStep } from '@requests/common/components/operator-details';
import { getOrganisationStructureFromUserInput } from '@requests/common/components/operator-details/organisation-details/organisation-details.util';
import { TaskItemStatus } from '@requests/common/task-item-status';
import { UploadedFile } from '@shared/types';
import { transformToTaskAttachments } from '@shared/utils';

export class AerOrganisationDetailsPayloadMutator extends PayloadMutator {
  readonly subtask = OPERATOR_DETAILS_SUB_TASK;
  step = OperatorDetailsWizardStep.OPERATOR_DETAILS_ORGANISATION_DETAILS;

  apply(
    currentPayload: AerSubmitTaskPayload,
    userInput: Omit<OrganisationStructure, 'sameAsContactAddress'> &
      Partial<PartnershipOrganisation> & {
        registrationNumber?: string;
        fullName?: string;
        evidenceFiles?: UploadedFile[];
        sameAsContactAddress?: Array<boolean>;
      },
  ): Observable<AerSubmitTaskPayload> {
    return of(
      produce(currentPayload, (payload) => {
        const legalStatusType = payload.aer[this.subtask]['organisationStructure']?.legalStatusType;
        payload.aer[this.subtask]['organisationStructure'] = getOrganisationStructureFromUserInput(
          userInput,
          legalStatusType,
        );

        if (legalStatusType === 'LIMITED_COMPANY') {
          payload.aerAttachments = {
            ...payload.aerAttachments,
            ...transformToTaskAttachments(userInput?.evidenceFiles),
          };
        }

        payload.aerSectionsCompleted[this.subtask] = TaskItemStatus.IN_PROGRESS;
      }),
    );
  }
}
