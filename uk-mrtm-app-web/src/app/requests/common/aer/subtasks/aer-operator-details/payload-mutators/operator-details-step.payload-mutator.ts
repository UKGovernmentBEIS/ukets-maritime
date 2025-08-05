import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { Aer, AerOperatorDetails } from '@mrtm/api';

import { PayloadMutator } from '@netz/common/forms';

import { AerSubmitTaskPayload } from '@requests/common/aer/aer.types';
import { OPERATOR_DETAILS_SUB_TASK, OperatorDetailsWizardStep } from '@requests/common/components/operator-details';
import { TaskItemStatus } from '@requests/common/task-item-status';

export class AerOperatorDetailsStepPayloadMutator extends PayloadMutator {
  readonly subtask = OPERATOR_DETAILS_SUB_TASK;
  step = OperatorDetailsWizardStep.OPERATOR_DETAILS_OPERATOR_FORM;

  apply(
    currentPayload: AerSubmitTaskPayload,
    userInput: Pick<AerOperatorDetails, 'operatorName' | 'imoNumber' | 'contactAddress'>,
  ): Observable<AerSubmitTaskPayload> {
    return of(
      produce(currentPayload, (payload) => {
        payload.aer = {
          ...(payload.aer ?? {}),
          [this.subtask]: {
            ...(payload.aer?.[this.subtask] ?? {}),
            ...userInput,
          },
        } as Aer;

        if (payload?.aer?.[this.subtask]?.organisationStructure?.sameAsContactAddress === true) {
          payload.aer[this.subtask].organisationStructure = {
            ...(payload?.aer?.[this.subtask]?.organisationStructure ?? {}),
            registeredAddress: payload?.aer?.[this.subtask]?.organisationStructure?.sameAsContactAddress
              ? userInput?.contactAddress
              : (payload?.aer?.[this.subtask]?.organisationStructure?.registeredAddress ?? {}),
          } as AerOperatorDetails['organisationStructure'];
        }

        payload.aerSectionsCompleted[this.subtask] = TaskItemStatus.IN_PROGRESS;
      }),
    );
  }
}
