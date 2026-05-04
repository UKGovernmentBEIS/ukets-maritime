import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { EmpRegisteredOwner } from '@mrtm/api';

import { PayloadMutator } from '@netz/common/forms';

import { EmpTaskPayload } from '@requests/common/emp/emp.types';
import { MANDATE_SUB_TASK, MandateWizardStep } from '@requests/common/emp/subtasks/mandate/mandate.helper';

export class DeleteRegisteredOwnerPayloadMutator extends PayloadMutator {
  public readonly subtask: string = MANDATE_SUB_TASK;
  public readonly step: string = MandateWizardStep.DELETE_REGISTERED_OWNER;

  public apply(
    currentPayload: EmpTaskPayload,
    userInput: EmpRegisteredOwner['uniqueIdentifier'],
  ): Observable<EmpTaskPayload> {
    return of(
      produce(currentPayload, (payload: EmpTaskPayload) => {
        payload.emissionsMonitoringPlan.mandate = {
          ...payload.emissionsMonitoringPlan.mandate,
          responsibilityDeclaration: null,
          registeredOwners: payload.emissionsMonitoringPlan.mandate.registeredOwners.filter(
            (registeredOwner) => registeredOwner.uniqueIdentifier !== userInput,
          ),
        };
      }),
    );
  }
}
