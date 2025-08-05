import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { AerPort } from '@mrtm/api';

import { PayloadMutator } from '@netz/common/forms';

import { AerSubmitTaskPayload } from '@requests/common/aer/aer.types';
import {
  AER_PORTS_SUB_TASK,
  AerPortsWizardStep,
  isPortWizardCompleted,
} from '@requests/common/aer/subtasks/aer-ports/aer-ports.helpers';
import { TaskItemStatus } from '@requests/common/task-item-status';

export class AerPortsUploadPayloadMutator extends PayloadMutator {
  public readonly subtask = AER_PORTS_SUB_TASK;
  public readonly step = AerPortsWizardStep.UPLOAD_PORTS;

  public apply(currentPayload: AerSubmitTaskPayload, userInput: AerPort[]): Observable<AerSubmitTaskPayload> {
    return of(
      produce(currentPayload, (payload: AerSubmitTaskPayload) => {
        const existingPorts = payload.aer.portEmissions?.ports || [];
        const userInputMap = new Map<string, AerPort>();
        userInput.forEach((port) => {
          userInputMap.set(port.uniqueIdentifier, port);
        });
        const filteredExistingPorts = existingPorts.filter((port) => !userInputMap.has(port.uniqueIdentifier));
        const mergedPorts = [...filteredExistingPorts, ...userInput];

        payload.aer.portEmissions.ports = mergedPorts;
        payload.aerSectionsCompleted[this.subtask] = TaskItemStatus.IN_PROGRESS;

        mergedPorts.forEach((port) => {
          payload.aerSectionsCompleted[`${this.subtask}-port-call-${port.uniqueIdentifier}`] = isPortWizardCompleted(
            port,
            true,
          )
            ? TaskItemStatus.COMPLETED
            : TaskItemStatus.IN_PROGRESS;
        });
      }),
    );
  }
}
