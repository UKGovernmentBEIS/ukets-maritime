import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { OrganisationStructure, PartnershipOrganisation } from '@mrtm/api';

import { PayloadMutator } from '@netz/common/forms';

import {
  getOrganisationStructureFromUserInput,
  OPERATOR_DETAILS_SUB_TASK,
  OperatorDetailsWizardStep,
} from '@requests/common/components/operator-details';
import { EmpTaskPayload } from '@requests/common/emp/emp.types';
import { TaskItemStatus } from '@requests/common/task-item-status';
import { UploadedFile } from '@shared/types';
import { transformToTaskAttachments } from '@shared/utils';

export class OrganisationDetailsPayloadMutator extends PayloadMutator {
  readonly subtask = OPERATOR_DETAILS_SUB_TASK;
  step = OperatorDetailsWizardStep.OPERATOR_DETAILS_ORGANISATION_DETAILS;

  apply(
    currentPayload: EmpTaskPayload,
    userInput: Omit<OrganisationStructure, 'sameAsContactAddress'> &
      Partial<PartnershipOrganisation> & {
        registrationNumber?: string;
        fullName?: string;
        evidenceFiles?: UploadedFile[];
        sameAsContactAddress?: Array<boolean>;
      },
  ): Observable<EmpTaskPayload> {
    return of(
      produce(currentPayload, (payload) => {
        const legalStatusType = payload.emissionsMonitoringPlan[this.subtask]['organisationStructure']?.legalStatusType;
        payload.emissionsMonitoringPlan[this.subtask]['organisationStructure'] = getOrganisationStructureFromUserInput(
          userInput,
          legalStatusType,
        );

        if (legalStatusType === 'LIMITED_COMPANY') {
          payload.empAttachments = {
            ...payload.empAttachments,
            ...transformToTaskAttachments(userInput?.evidenceFiles),
          };
        }

        payload.empSectionsCompleted[this.subtask] = TaskItemStatus.IN_PROGRESS;
      }),
    );
  }
}
