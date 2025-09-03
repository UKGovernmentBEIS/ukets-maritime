import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { PayloadMutator } from '@netz/common/forms';

import { EmpTaskPayload } from '@requests/common/emp/emp.types';
import { MANDATE_SUB_TASK, MandateWizardStep } from '@requests/common/emp/subtasks/mandate/mandate.helper';
import { MandateResponsibilityDeclarationFormType } from '@requests/common/emp/subtasks/mandate/mandate-responsibility-declaration/mandate-responsibility-declaration.types';

export class MandateResponsibilityDeclarationPayloadMutator extends PayloadMutator {
  public subtask: string = MANDATE_SUB_TASK;
  public step: string = MandateWizardStep.RESPONSIBILITY_DECLARATION;

  public apply(
    currentPayload: EmpTaskPayload,
    userInput: MandateResponsibilityDeclarationFormType,
  ): Observable<EmpTaskPayload> {
    return of(
      produce(currentPayload, (payload: EmpTaskPayload) => {
        payload.emissionsMonitoringPlan.mandate = {
          ...payload.emissionsMonitoringPlan.mandate,
          responsibilityDeclaration: [userInput?.responsibilityDeclaration ?? []].flat().every(Boolean),
        };
      }),
    );
  }
}
