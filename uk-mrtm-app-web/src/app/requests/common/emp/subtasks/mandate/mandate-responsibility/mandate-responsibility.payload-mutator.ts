import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { PayloadMutator } from '@netz/common/forms';

import { EmpTaskPayload } from '@requests/common/emp/emp.types';
import { MANDATE_SUB_TASK, MandateWizardStep } from '@requests/common/emp/subtasks/mandate/mandate.helper';
import { MandateResponsibilityFormModel } from '@requests/common/emp/subtasks/mandate/mandate-responsibility/mandate-responsibility.types';

export class MandateResponsibilityPayloadMutator extends PayloadMutator {
  public subtask: string = MANDATE_SUB_TASK;
  public step: string = MandateWizardStep.RESPONSIBILITY;

  public apply(currentPayload: EmpTaskPayload, userInput: MandateResponsibilityFormModel): Observable<any> {
    return of(
      produce(currentPayload, (payload: EmpTaskPayload) => {
        payload.emissionsMonitoringPlan.mandate = {
          ...payload?.emissionsMonitoringPlan?.mandate,
          ...userInput,
          registeredOwners: userInput.exist ? payload?.emissionsMonitoringPlan?.mandate?.registeredOwners : undefined,
        };
      }),
    );
  }
}
