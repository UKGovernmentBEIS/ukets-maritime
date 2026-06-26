import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { AerPort } from '@mrtm/api';

import { PayloadMutator } from '@netz/common/forms';

import { AerSubmitTaskPayload } from '@requests/common/aer/aer.types';
import { AerPortsWizardStep } from '@requests/common/aer/subtasks/aer-ports';
import { AER_PORTS_SUB_TASK } from '@requests/common/aer/subtasks/aer-ports/aer-ports.helpers';
import { TaskItemStatus } from '@requests/common/task-item-status';

export const provideAerPortCallSummaryPayloadMutator = (
  step: AerPortsWizardStep.NEW_PORT_CALL_SUMMARY | AerPortsWizardStep.PORT_CALL_SUMMARY,
): PayloadMutator =>
  ({
    subtask: AER_PORTS_SUB_TASK,
    step,
    apply: (
      currentPayload: AerSubmitTaskPayload,
      userInput: AerPort['uniqueIdentifier'],
    ): Observable<AerSubmitTaskPayload> => {
      return of(
        produce(currentPayload, (payload: AerSubmitTaskPayload) => {
          payload.aerSectionsCompleted[AER_PORTS_SUB_TASK] = TaskItemStatus.IN_PROGRESS;
          payload.aerSectionsCompleted[`${AER_PORTS_SUB_TASK}-port-call-${userInput}`] = TaskItemStatus.COMPLETED;
        }),
      );
    },
  }) as PayloadMutator;
