import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { AerPort } from '@mrtm/api';

import { PayloadMutator } from '@netz/common/forms';

import { AerSubmitTaskPayload } from '@requests/common/aer/aer.types';
import { AER_PORTS_SUB_TASK, AerPortsWizardStep } from '@requests/common/aer/subtasks/aer-ports/aer-ports.helpers';
import { TaskItemStatus } from '@requests/common/task-item-status';

export class AerPortDeleteDirectEmissionPayloadMutator extends PayloadMutator {
  public readonly subtask: string = AER_PORTS_SUB_TASK;
  public readonly step: string = AerPortsWizardStep.DELETE_DIRECT_EMISSIONS;

  public apply(
    currentPayload: AerSubmitTaskPayload,
    userInput: AerPort['uniqueIdentifier'],
  ): Observable<AerSubmitTaskPayload> {
    return of(
      produce(currentPayload, (payload: AerSubmitTaskPayload) => {
        payload.aer.portEmissions.ports = payload.aer.portEmissions.ports.map((port) =>
          port.uniqueIdentifier === userInput ? { ...port, directEmissions: undefined } : port,
        );

        payload.aerSectionsCompleted[this.subtask] = TaskItemStatus.IN_PROGRESS;
        payload.aerSectionsCompleted[`${this.subtask}-port-call-${userInput}`] = TaskItemStatus.IN_PROGRESS;
      }),
    );
  }
}
