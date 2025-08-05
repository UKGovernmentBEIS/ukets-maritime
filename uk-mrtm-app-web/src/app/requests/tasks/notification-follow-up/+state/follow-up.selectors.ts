import {
  createAggregateSelector,
  createDescendingSelector,
  requestTaskQuery,
  RequestTaskState,
  StateSelector,
} from '@netz/common/store';

import { empCommonQuery } from '@requests/common/emp/+state';
import { TaskItemStatus } from '@requests/common/task-item-status';
import { FollowUpTaskPayload } from '@requests/tasks/notification-follow-up/follow-up.types';
import { isWizardCompleted } from '@requests/tasks/notification-follow-up/subtasks/follow-up-response/follow-up-response.wizard';
import { AttachedFile } from '@shared/types';

const selectPayload: StateSelector<RequestTaskState, FollowUpTaskPayload> = createDescendingSelector(
  requestTaskQuery.selectRequestTaskPayload,
  (payload) => payload as FollowUpTaskPayload,
);

const selectStatusForSubtask = (
  subtask: 'followUpResponse' | 'submitToRegulator',
): StateSelector<RequestTaskState, TaskItemStatus> =>
  createDescendingSelector(selectPayload, (payload) => {
    const followUpResponse = isWizardCompleted(payload)
      ? (payload.sectionsCompleted?.['followUpResponse'] as TaskItemStatus)
      : TaskItemStatus.NOT_STARTED;

    switch (subtask) {
      case 'submitToRegulator':
        return followUpResponse !== TaskItemStatus.COMPLETED
          ? TaskItemStatus.CANNOT_START_YET
          : TaskItemStatus.NOT_STARTED;
      case 'followUpResponse':
        return followUpResponse;
    }
  });

const selectAttachedFiles = (files?: Array<string>): StateSelector<RequestTaskState, AttachedFile[]> =>
  createAggregateSelector(empCommonQuery.selectTasksDownloadUrl, selectPayload, (downloadUrl: string, payload) =>
    files?.map((id) => ({
      downloadUrl: `${downloadUrl}${id}`,
      fileName: payload?.followUpAttachments[id],
    })),
  );

const selectFollowUpFiles: StateSelector<RequestTaskState, string[]> = createDescendingSelector(
  selectPayload,
  (payload) => payload?.followUpFiles,
);

export const followUpQuery = {
  selectPayload,
  selectStatusForSubtask,
  selectAttachedFiles,
  selectFollowUpFiles,
};
