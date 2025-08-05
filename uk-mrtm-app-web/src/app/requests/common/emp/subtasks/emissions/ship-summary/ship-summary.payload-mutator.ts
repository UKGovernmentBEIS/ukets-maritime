import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { PayloadMutator } from '@netz/common/forms';

import { EMISSIONS_SUB_TASK } from '@requests/common/components/emissions/emissions.helpers';
import { EmpTaskPayload } from '@requests/common/emp/emp.types';
import { EmissionsWizardStep } from '@requests/common/emp/subtasks/emissions/emissions.helpers';
import { TaskItemStatus } from '@requests/common/task-item-status';

export class ShipSummaryPayloadMutator extends PayloadMutator {
  subtask = EMISSIONS_SUB_TASK;
  step = EmissionsWizardStep.SHIP_SUMMARY;

  apply(currentPayload: EmpTaskPayload, userInput: string): Observable<any> {
    return of(
      produce(currentPayload, (payload: EmpTaskPayload) => {
        payload.empSectionsCompleted[`${this.subtask}-ship-${userInput}`] = TaskItemStatus.COMPLETED;
        payload.empSectionsCompleted[this.subtask] = TaskItemStatus.IN_PROGRESS;
      }),
    );
  }
}
