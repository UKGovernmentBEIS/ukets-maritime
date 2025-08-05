import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { AerFuelConsumption, AerPort } from '@mrtm/api';

import { PayloadMutator } from '@netz/common/forms';

import { AerSubmitTaskPayload } from '@requests/common/aer/aer.types';
import { AER_PORTS_SUB_TASK, AerPortsWizardStep } from '@requests/common/aer/subtasks/aer-ports/aer-ports.helpers';
import { TaskItemStatus } from '@requests/common/task-item-status';

export class AerPortDeleteFuelConsumptionPayloadMutator extends PayloadMutator {
  public readonly subtask: string = AER_PORTS_SUB_TASK;
  public readonly step: string = AerPortsWizardStep.DELETE_FUEL_CONSUMPTION;

  public apply(
    currentPayload: AerSubmitTaskPayload,
    userInput: Pick<AerFuelConsumption, 'uniqueIdentifier'> & { objectId: AerPort['uniqueIdentifier'] },
  ): Observable<AerSubmitTaskPayload> {
    return of(
      produce(currentPayload, (payload: AerSubmitTaskPayload) => {
        const { objectId, uniqueIdentifier } = userInput;

        payload.aer.portEmissions.ports = payload.aer.portEmissions.ports.map((port) =>
          port.uniqueIdentifier === objectId
            ? {
                ...port,
                fuelConsumptions: (port.fuelConsumptions ?? []).filter(
                  (fuelConsumption) => fuelConsumption.uniqueIdentifier !== uniqueIdentifier,
                ),
              }
            : port,
        );

        payload.aerSectionsCompleted[this.subtask] = TaskItemStatus.IN_PROGRESS;
        payload.aerSectionsCompleted[`${this.subtask}-port-call-${objectId}`] = TaskItemStatus.IN_PROGRESS;
      }),
    );
  }
}
