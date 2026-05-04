import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { PayloadMutator } from '@netz/common/forms';

import { TaskItemStatus } from '@requests/common/task-item-status';
import { NotificationTaskPayload } from '@requests/tasks/notification-submit/notification.types';
import {
  DETAILS_CHANGE_SUB_TASK,
  DetailsChangeWizardStep,
} from '@requests/tasks/notification-submit/subtasks/details-change/details-change.helper';
import { NonSignificantChangeFormType } from '@requests/tasks/notification-submit/subtasks/details-change/non-significant-change/non-significant-change.types';
import { createFileUploadPayload, isNil, transformToTaskAttachments } from '@shared/utils';

export class NonSignificantChangePayloadMutator extends PayloadMutator {
  subtask = DETAILS_CHANGE_SUB_TASK;
  step = DetailsChangeWizardStep.NON_SIGNIFICANT_CHANGE;

  apply(
    currentPayload: NotificationTaskPayload,
    userInput: NonSignificantChangeFormType,
  ): Observable<NotificationTaskPayload> {
    return of(
      produce(currentPayload, (payload: NotificationTaskPayload) => {
        if (isNil(payload.emissionsMonitoringPlanNotification)) {
          payload.emissionsMonitoringPlanNotification = {} as any;
        }

        payload.emissionsMonitoringPlanNotification[this.subtask] = {
          ...payload?.emissionsMonitoringPlanNotification?.[this.subtask],
          ...userInput,
          documents: createFileUploadPayload(userInput.documents),
        };
        payload.empNotificationAttachments = {
          ...payload.empNotificationAttachments,
          ...transformToTaskAttachments(userInput.documents),
        };
        payload.sectionsCompleted[this.subtask] = TaskItemStatus.IN_PROGRESS;
      }),
    );
  }
}
