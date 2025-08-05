import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { EmpShipEmissions } from '@mrtm/api';

import { PayloadMutator } from '@netz/common/forms';

import { EMISSIONS_SUB_TASK } from '@requests/common/components/emissions/emissions.helpers';
import { EmpTaskPayload } from '@requests/common/emp/emp.types';
import { isShipWizardCompleted } from '@requests/common/emp/subtasks/emissions';
import { EmissionsWizardStep } from '@requests/common/emp/subtasks/emissions/emissions.helpers';
import { TaskItemStatus } from '@requests/common/task-item-status';

export class EmpUploadShipsPayloadMutator extends PayloadMutator {
  readonly subtask = EMISSIONS_SUB_TASK;
  step = EmissionsWizardStep.UPLOAD_SHIPS;

  apply(currentPayload: EmpTaskPayload, userInput: EmpShipEmissions[]): Observable<any> {
    return of(
      produce(currentPayload, (payload) => {
        payload.emissionsMonitoringPlan[this.subtask] = { ships: userInput };

        /**
         * Delete previous empSectionsCompleted keys that are referencing ships
         */
        for (const key in payload?.empSectionsCompleted) {
          if (key.startsWith(`${this.subtask}-ship-`)) {
            delete payload?.empSectionsCompleted[key];
          }
        }

        /**
         * Set correct status for each uploaded ship
         */
        for (const ship of userInput) {
          payload.empSectionsCompleted[`${this.subtask}-ship-${ship.uniqueIdentifier}`] = isShipWizardCompleted(ship)
            ? TaskItemStatus.COMPLETED
            : TaskItemStatus.IN_PROGRESS;
        }

        payload.empSectionsCompleted[this.subtask] = TaskItemStatus.IN_PROGRESS;
      }),
    );
  }
}
