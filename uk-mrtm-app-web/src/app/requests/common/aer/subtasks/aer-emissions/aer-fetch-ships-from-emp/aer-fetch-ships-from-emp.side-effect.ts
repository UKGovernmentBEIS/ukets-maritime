import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { SideEffect, SubtaskOperation } from '@netz/common/forms';

import { AerSubmitTaskPayload } from '@requests/common/aer/aer.types';
import { AerEmissionsWizardStep } from '@requests/common/aer/subtasks/aer-emissions/aer-emissions.helpers';
import { EMISSIONS_SUB_TASK } from '@requests/common/components/emissions/emissions.helpers';
import { TaskItemStatus } from '@requests/common/task-item-status';

export class AerFetchShipsFromEmpSideEffect extends SideEffect {
  subtask = EMISSIONS_SUB_TASK;
  step = AerEmissionsWizardStep.FETCH_FROM_EMP;
  on: SubtaskOperation[] = ['SAVE_SUBTASK'];

  apply(currentPayload: AerSubmitTaskPayload): Observable<any> {
    return of(
      produce(currentPayload, (payload) => {
        for (const ship of payload?.aer?.emissions?.ships ?? []) {
          payload.aerSectionsCompleted[`${this.subtask}-ship-${ship.uniqueIdentifier}`] = TaskItemStatus.IN_PROGRESS;
        }

        payload.aerSectionsCompleted[EMISSIONS_SUB_TASK] = TaskItemStatus.IN_PROGRESS;
      }),
    );
  }
}
