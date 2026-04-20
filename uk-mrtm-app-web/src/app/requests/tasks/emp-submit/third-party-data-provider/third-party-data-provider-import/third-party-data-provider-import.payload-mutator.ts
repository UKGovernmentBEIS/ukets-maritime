import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { EmissionsMonitoringPlan } from '@mrtm/api';

import { PayloadMutator } from '@netz/common/forms';

import { EmpTaskPayload } from '@requests/common';
import { EMISSIONS_SUB_TASK } from '@requests/common/components/emissions/emissions.helpers';
import { TaskItemStatus } from '@requests/common/task-item-status';
import {
  IMPORT_THIRD_PARTY_DATA_PROVIDER_SUB_TASK,
  SUBTASKS_AFFECTED_BY_IMPORT,
} from '@requests/tasks/emp-submit/third-party-data-provider/third-party-data-provider.const';
import { ThirdPartyDataProviderPayload } from '@requests/tasks/emp-submit/third-party-data-provider/third-party-data-provider.interface';

export class ThirdPartyDataProviderImportPayloadMutator extends PayloadMutator {
  readonly subtask = IMPORT_THIRD_PARTY_DATA_PROVIDER_SUB_TASK;
  readonly step = null;

  apply(currentPayload: EmpTaskPayload, userInput: ThirdPartyDataProviderPayload): Observable<EmpTaskPayload> {
    return of(
      produce(currentPayload, (payload: EmpTaskPayload) => {
        SUBTASKS_AFFECTED_BY_IMPORT.forEach((subtask) => {
          (payload.emissionsMonitoringPlan[subtask] as EmissionsMonitoringPlan[typeof subtask]) = userInput[subtask];
          payload.empSectionsCompleted[subtask] = TaskItemStatus.IN_PROGRESS;

          if (subtask === EMISSIONS_SUB_TASK) {
            Object.keys(payload.empSectionsCompleted).forEach((key) => {
              if (key.startsWith(`${EMISSIONS_SUB_TASK}-ship-`)) {
                delete payload.empSectionsCompleted[key];
              }
            });
            userInput[EMISSIONS_SUB_TASK].ships.forEach((ship) => {
              payload.empSectionsCompleted[`${EMISSIONS_SUB_TASK}-ship-${ship.uniqueIdentifier}`] =
                TaskItemStatus.COMPLETED;
            });
          }
        });
      }),
    );
  }
}
