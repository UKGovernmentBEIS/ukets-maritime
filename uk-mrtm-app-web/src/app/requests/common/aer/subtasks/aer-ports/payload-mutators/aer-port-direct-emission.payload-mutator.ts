import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { AerPortSave } from '@mrtm/api';

import { PayloadMutator } from '@netz/common/forms';

import { AerSubmitTaskPayload } from '@requests/common/aer/aer.types';
import { AerDirectEmissionsFormModel } from '@requests/common/aer/components/aer-direct-emission/aer-direct-emission.types';
import { AER_PORTS_SUB_TASK, AerPortsWizardStep } from '@requests/common/aer/subtasks/aer-ports/aer-ports.helpers';
import { TaskItemStatus } from '@requests/common/task-item-status';

export class AerPortDirectEmissionPayloadMutator extends PayloadMutator {
  public readonly subtask: string = AER_PORTS_SUB_TASK;
  public readonly step: string = AerPortsWizardStep.DIRECT_EMISSIONS;

  public apply(currentPayload: AerSubmitTaskPayload, userInput: AerDirectEmissionsFormModel): Observable<any> {
    return of(
      produce(currentPayload, (payload: AerSubmitTaskPayload) => {
        const { uniqueIdentifier, ...directEmissions } = userInput;

        payload.aer.portEmissions.ports = payload.aer.portEmissions.ports.map((port) =>
          port.uniqueIdentifier === uniqueIdentifier ? ({ ...port, directEmissions } as AerPortSave) : port,
        ) as any;

        payload.aerSectionsCompleted[this.subtask] = TaskItemStatus.IN_PROGRESS;
        payload.aerSectionsCompleted[`${this.subtask}-port-call-${uniqueIdentifier}`] = TaskItemStatus.IN_PROGRESS;
      }),
    );
  }
}
