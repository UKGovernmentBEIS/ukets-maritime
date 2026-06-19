import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { AerPort } from '@mrtm/api';

import { PayloadMutator } from '@netz/common/forms';

import { AerSubmitTaskPayload } from '@requests/common/aer/aer.types';
import { AerPortsWizardStep } from '@requests/common/aer/subtasks/aer-ports';
import { AER_PORTS_SUB_TASK } from '@requests/common/aer/subtasks/aer-ports/aer-ports.helpers';
import { TaskItemStatus } from '@requests/common/task-item-status';

export class AerPortCallSummaryPayloadMutator extends PayloadMutator {
  public readonly subtask = AER_PORTS_SUB_TASK;
  public readonly step = AerPortsWizardStep.PORT_CALL_SUMMARY;

  public apply(
    currentPayload: AerSubmitTaskPayload,
    userInput: AerPort['uniqueIdentifier'],
  ): Observable<AerSubmitTaskPayload> {
    return of(
      produce(currentPayload, (payload: AerSubmitTaskPayload) => {
        payload.aerSectionsCompleted[this.subtask] = TaskItemStatus.IN_PROGRESS;
        payload.aerSectionsCompleted[`${this.subtask}-port-call-${userInput}`] = TaskItemStatus.COMPLETED;
      }),
    );
  }
}
