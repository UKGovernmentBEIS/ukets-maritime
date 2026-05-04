import { Provider } from '@angular/core';

import { of } from 'rxjs';
import { produce } from 'immer';

import { PAYLOAD_MUTATORS } from '@netz/common/forms';
import { RequestTaskStore } from '@netz/common/store';

import { EmpTaskPayload } from '@requests/common/emp/emp.types';
import { MANDATE_SUB_TASK, MandateWizardStep } from '@requests/common/emp/subtasks/mandate/mandate.helper';
import { MandateRegisteredOwnersFormModel } from '@requests/common/emp/subtasks/mandate/mandate-registered-owners-form/mandate-registered-owners-form.types';

export const provideMandateRegisteredOwnersFormPayloadMutator = (
  step: MandateWizardStep.REGISTERED_OWNERS_FORM_ADD | MandateWizardStep.REGISTERED_OWNERS_FORM_EDIT,
): Provider => ({
  provide: PAYLOAD_MUTATORS,
  multi: true,
  deps: [RequestTaskStore],
  useFactory: (store: RequestTaskStore) => ({
    subtask: MANDATE_SUB_TASK,
    store,
    step,
    apply: (currentPayload: EmpTaskPayload, userInput: MandateRegisteredOwnersFormModel) =>
      of(
        produce(currentPayload, (payload: EmpTaskPayload) => {
          const registeredOwners = payload?.emissionsMonitoringPlan?.mandate?.registeredOwners ?? [];

          payload.emissionsMonitoringPlan.mandate = {
            ...payload?.emissionsMonitoringPlan?.mandate,
            responsibilityDeclaration: null,
            registeredOwners: registeredOwners.find(
              (registeredOwner) => registeredOwner.uniqueIdentifier === userInput.uniqueIdentifier,
            )
              ? registeredOwners.map((registeredOwner) =>
                  registeredOwner.uniqueIdentifier === userInput.uniqueIdentifier ? userInput : registeredOwner,
                )
              : [
                  ...registeredOwners,
                  {
                    ...userInput,
                  },
                ],
          };
        }),
      ),
  }),
});
