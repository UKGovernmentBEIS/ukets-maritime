import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { EmpRegisteredOwner } from '@mrtm/api';

import { PayloadMutator } from '@netz/common/forms';

import { EmpTaskPayload } from '@requests/common/emp/emp.types';
import { MANDATE_SUB_TASK, MandateWizardStep } from '@requests/common/emp/subtasks/mandate/mandate.helper';

export class MandateUploadPayloadMutator extends PayloadMutator {
  public subtask: string = MANDATE_SUB_TASK;
  public step: string = MandateWizardStep.UPLOAD_OWNERS;

  public apply(currentPayload: EmpTaskPayload, userInput: EmpRegisteredOwner[]): Observable<EmpTaskPayload> {
    return of(
      produce(currentPayload, (payload: EmpTaskPayload) => {
        payload.emissionsMonitoringPlan.mandate.registeredOwners = userInput;
      }),
    );
  }
}
