import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { PayloadMutator } from '@netz/common/forms';

import { AerSubmitTaskPayload } from '@requests/common/aer/aer.types';
import { AerDerogationsFormModel } from '@requests/common/aer/subtasks/aer-emissions/aer-derogations/aer-derogations.types';
import { AerEmissionsWizardStep } from '@requests/common/aer/subtasks/aer-emissions/aer-emissions.helpers';
import { EMISSIONS_SUB_TASK } from '@requests/common/components/emissions/emissions.helpers';
import { TaskItemStatus } from '@requests/common/task-item-status';

export class AerDerogationsPayloadMutator extends PayloadMutator {
  readonly subtask = EMISSIONS_SUB_TASK;
  step = AerEmissionsWizardStep.DEROGATIONS;

  apply(currentPayload: AerSubmitTaskPayload, userInput: AerDerogationsFormModel): Observable<any> {
    return of(
      produce(currentPayload, (payload: AerSubmitTaskPayload) => {
        const { uniqueIdentifier, ...derogations } = userInput;

        payload.aer[this.subtask] = {
          ships: (payload.aer[this.subtask]?.ships ?? []).map((ship) =>
            ship.uniqueIdentifier === uniqueIdentifier ? { ...ship, derogations } : ship,
          ),
        };

        payload.aerSectionsCompleted[`${this.subtask}-ship-${userInput.uniqueIdentifier}`] = TaskItemStatus.IN_PROGRESS;
        payload.aerSectionsCompleted[this.subtask] = TaskItemStatus.IN_PROGRESS;
      }),
    );
  }
}
