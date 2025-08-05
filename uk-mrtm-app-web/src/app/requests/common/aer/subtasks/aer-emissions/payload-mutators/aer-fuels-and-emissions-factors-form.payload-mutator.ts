import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { PayloadMutator } from '@netz/common/forms';

import { AerSubmitTaskPayload } from '@requests/common/aer/aer.types';
import { AerEmissionsWizardStep } from '@requests/common/aer/subtasks/aer-emissions/aer-emissions.helpers';
import { EMISSIONS_SUB_TASK } from '@requests/common/components/emissions/emissions.helpers';
import { FuelsAndEmissionsFactorsFormType } from '@requests/common/components/emissions/fuels-and-emissions-factors-form/fuels-and-emissions-factors-form.types';
import { TaskItemStatus } from '@requests/common/task-item-status';

export class AerFuelsAndEmissionFactorsFormPayloadMutator extends PayloadMutator {
  readonly subtask = EMISSIONS_SUB_TASK;
  step = AerEmissionsWizardStep.FUELS_AND_EMISSIONS_FORM;

  apply(currentPayload: AerSubmitTaskPayload, userInput: FuelsAndEmissionsFactorsFormType): Observable<any> {
    return of(
      produce(currentPayload, (payload: AerSubmitTaskPayload) => {
        const { uniqueIdentifier, shipId, ...formData } = userInput;
        const editedShip = payload.aer[this.subtask]?.ships?.find((ship) => ship.uniqueIdentifier === shipId);
        const editedItem = editedShip.fuelsAndEmissionsFactors?.find(
          (item) => item.uniqueIdentifier === uniqueIdentifier,
        );
        if (formData.type !== 'OTHER') {
          delete formData.name;
        }
        if ((formData?.nitrousOxide as any) === 'OTHER') {
          formData.nitrousOxide = formData.otherNitrousOxide;
        }
        delete formData?.otherNitrousOxide;

        const fuelsAndEmissionsFactors = editedItem
          ? editedShip.fuelsAndEmissionsFactors.map((item) =>
              item.uniqueIdentifier === uniqueIdentifier ? { ...formData, uniqueIdentifier } : item,
            )
          : [...editedShip.fuelsAndEmissionsFactors, { ...formData, uniqueIdentifier }];

        payload.aer[this.subtask].ships = payload.aer[this.subtask].ships.map((ship) =>
          ship.uniqueIdentifier === shipId ? { ...editedShip, fuelsAndEmissionsFactors } : ship,
        );

        payload.aerSectionsCompleted[`${this.subtask}-ship-${userInput.shipId}`] = TaskItemStatus.IN_PROGRESS;
        payload.aerSectionsCompleted[this.subtask] = TaskItemStatus.IN_PROGRESS;
      }),
    );
  }
}
