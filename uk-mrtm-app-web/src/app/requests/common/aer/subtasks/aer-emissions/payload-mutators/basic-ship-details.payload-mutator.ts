import { Observable, of } from 'rxjs';
import { produce } from 'immer';
import { format } from 'date-fns';

import { AerShipDetails, AerShipEmissions } from '@mrtm/api';

import { PayloadMutator } from '@netz/common/forms';

import { AerSubmitTaskPayload } from '@requests/common/aer/aer.types';
import { AerEmissionsWizardStep } from '@requests/common/aer/subtasks/aer-emissions/aer-emissions.helpers';
import { EMISSIONS_SUB_TASK } from '@requests/common/components/emissions/emissions.helpers';
import { TaskItemStatus } from '@requests/common/task-item-status';

type AerShipDetailsFormModel = Omit<AerShipDetails, 'from' | 'to'> & {
  uniqueIdentifier: string;
  from?: Date;
  to?: Date;
};

const DATE_FORMAT = 'yyyy-MM-dd';

export class AerBasicShipDetailPayloadMutator extends PayloadMutator {
  readonly subtask = EMISSIONS_SUB_TASK;
  step = AerEmissionsWizardStep.BASIC_DETAILS;

  apply(currentPayload: AerSubmitTaskPayload, userInput: AerShipDetailsFormModel): Observable<any> {
    return of(
      produce(currentPayload, (payload: AerSubmitTaskPayload) => {
        const { uniqueIdentifier, ...inputDetails } = userInput;
        const payloadShips = payload.aer[this.subtask]?.ships ?? [];
        const isEditMode = !!payloadShips.find((ship) => ship.uniqueIdentifier === uniqueIdentifier);

        const details: AerShipDetails = {
          ...inputDetails,
          from: inputDetails.from ? format(inputDetails.from, DATE_FORMAT) : undefined,
          to: inputDetails.to ? format(inputDetails.to, DATE_FORMAT) : undefined,
        };

        const ships = isEditMode
          ? payloadShips.map((ship) => (ship.uniqueIdentifier === uniqueIdentifier ? { ...ship, details } : ship))
          : [
              ...payloadShips,
              {
                uniqueIdentifier,
                details,
                fuelsAndEmissionsFactors: [],
                emissionsSources: [],
                uncertaintyLevel: [],
              } as AerShipEmissions,
            ];

        payload.aer[this.subtask] = { ships };

        payload.aerSectionsCompleted[`${this.subtask}-ship-${userInput.uniqueIdentifier}`] = TaskItemStatus.IN_PROGRESS;
        payload.aerSectionsCompleted[this.subtask] = TaskItemStatus.IN_PROGRESS;
      }),
    );
  }
}
