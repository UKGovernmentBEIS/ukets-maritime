import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { AerPort } from '@mrtm/api';

import { PayloadMutator } from '@netz/common/forms';

import { AerSubmitTaskPayload } from '@requests/common/aer/aer.types';
import { AER_PORTS_SUB_TASK, AerPortsWizardStep } from '@requests/common/aer/subtasks/aer-ports/aer-ports.helpers';
import { TaskItemStatus } from '@requests/common/task-item-status';

export class AerPortSelectShipPayloadMutator extends PayloadMutator {
  public readonly subtask: string = AER_PORTS_SUB_TASK;
  public readonly step: string = AerPortsWizardStep.SELECT_SHIP;

  apply(
    currentPayload: AerSubmitTaskPayload,
    userInput: Pick<AerPort, 'imoNumber' | 'uniqueIdentifier'>,
  ): Observable<any> {
    return of(
      produce(currentPayload, (payload: AerSubmitTaskPayload) => {
        const { uniqueIdentifier, imoNumber } = userInput;
        const port = payload?.aer?.portEmissions?.ports?.find((x) => x.uniqueIdentifier === userInput.uniqueIdentifier);

        if (port) {
          payload.aer.portEmissions.ports = payload.aer.portEmissions.ports.map((port) =>
            port.uniqueIdentifier === uniqueIdentifier
              ? {
                  ...port,
                  imoNumber,
                }
              : port,
          );
        } else {
          payload.aer.portEmissions = {
            ...payload?.aer?.portEmissions,
            ports: [...(payload?.aer?.portEmissions?.ports ?? []), { ...userInput } as any],
          };
        }

        payload.aerSectionsCompleted[this.subtask] = TaskItemStatus.IN_PROGRESS;
        payload.aerSectionsCompleted[`${this.subtask}-port-call-${userInput.uniqueIdentifier}`] =
          TaskItemStatus.IN_PROGRESS;
      }),
    );
  }
}
