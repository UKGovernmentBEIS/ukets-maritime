import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { AerFuelsAndEmissionsFactors, AerShipEmissions } from '@mrtm/api';

import { PayloadMutator } from '@netz/common/forms';

import { TaskItemStatus } from '@requests/common';
import { AerSubmitTaskPayload } from '@requests/common/aer/aer.types';
import { AerEmissionsWizardStep } from '@requests/common/aer/subtasks/aer-emissions/aer-emissions.helpers';
import { EMISSIONS_SUB_TASK } from '@requests/common/components/emissions/emissions.helpers';
import { getShipsSectionKey } from '@requests/common/utils/section-key-builder.helper';

export class AerFuelsAndEmissionFactorsListPayloadMutator extends PayloadMutator {
  readonly subtask = EMISSIONS_SUB_TASK;
  step = AerEmissionsWizardStep.FUELS_AND_EMISSIONS_LIST;

  apply(
    currentPayload: AerSubmitTaskPayload,
    userInput: {
      shipId: AerShipEmissions['uniqueIdentifier'];
      fuelId: AerFuelsAndEmissionsFactors['uniqueIdentifier'];
    },
  ): Observable<any> {
    return of(
      produce(currentPayload, (payload: AerSubmitTaskPayload) => {
        payload.aer[this.subtask].ships = [
          ...payload.aer[this.subtask].ships.map((ship: AerShipEmissions) => ({
            ...ship,
            fuelsAndEmissionsFactors: ship.fuelsAndEmissionsFactors.filter(
              (item) => item.uniqueIdentifier !== userInput.fuelId,
            ),
          })),
        ];

        payload.aerSectionsCompleted[getShipsSectionKey(userInput.shipId)] = TaskItemStatus.IN_PROGRESS;
        payload.aerSectionsCompleted[this.subtask] = TaskItemStatus.IN_PROGRESS;
      }),
    );
  }
}
