import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { PayloadMutator } from '@netz/common/forms';

import { AerSubmitTaskPayload } from '@requests/common/aer/aer.types';
import { AER_PORTS_SUB_TASK, AerPortsWizardStep } from '@requests/common/aer/subtasks/aer-ports/aer-ports.helpers';
import { TaskItemStatus } from '@requests/common/task-item-status';
import { AerPortSummaryItemDto } from '@shared/types';

export class AerPortDeletePayloadMutator extends PayloadMutator {
  public readonly subtask = AER_PORTS_SUB_TASK;
  public readonly step = AerPortsWizardStep.DELETE_PORT;

  public apply(
    currentPayload: AerSubmitTaskPayload,
    userInput: Array<AerPortSummaryItemDto>,
  ): Observable<AerSubmitTaskPayload> {
    return of(
      produce(currentPayload, (payload: AerSubmitTaskPayload) => {
        payload.aer.portEmissions.ports = payload.aer.portEmissions.ports.filter(
          (port) => !userInput.find((deletedPort) => deletedPort.uniqueIdentifier === port.uniqueIdentifier),
        );

        payload.aerSectionsCompleted[this.subtask] = !payload?.aer?.portEmissions.ports?.length
          ? undefined
          : TaskItemStatus.IN_PROGRESS;

        for (const deletedPort of userInput) {
          payload.aerSectionsCompleted[`${this.subtask}-port-call-${deletedPort.uniqueIdentifier}`] = undefined;
        }
      }),
    );
  }
}
