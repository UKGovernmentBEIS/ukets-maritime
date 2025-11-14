import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { EmpOutsourcedActivities } from '@mrtm/api';

import { PayloadMutator } from '@netz/common/forms';

import { EmpTaskPayload } from '@requests/common/emp/emp.types';
import {
  CONTROL_ACTIVITIES_SUB_TASK,
  ControlActivitiesWizardStep,
} from '@requests/common/emp/subtasks/control-activities';
import { TaskItemStatus } from '@requests/common/task-item-status';

export class ControlActivitiesOutsourcedActivitiesPayloadMutator extends PayloadMutator {
  subtask = CONTROL_ACTIVITIES_SUB_TASK;
  step = ControlActivitiesWizardStep.OUTSOURCED_ACTIVITIES;

  apply(currentPayload: EmpTaskPayload, userInput: EmpOutsourcedActivities): Observable<EmpTaskPayload> {
    return of(
      produce(currentPayload, (payload: EmpTaskPayload) => {
        payload.emissionsMonitoringPlan[this.subtask] = {
          ...payload.emissionsMonitoringPlan[this.subtask],
          outsourcedActivities: {
            ...userInput,
          },
        };
        payload.empSectionsCompleted[this.subtask] = TaskItemStatus.IN_PROGRESS;
      }),
    );
  }
}
