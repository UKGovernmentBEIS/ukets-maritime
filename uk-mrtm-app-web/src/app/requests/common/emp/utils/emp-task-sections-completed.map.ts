import { TaskItemStatus } from '@requests/common/task-item-status';
import { MrtmRequestActionType } from '@shared/types';

export const empTaskSectionsCompletedMap: Record<MrtmRequestActionType, Record<string, string>> = {};

export const empTaskSectionsCompletedDefaultStatusMap: Record<MrtmRequestActionType, TaskItemStatus> = {
  EMP_VARIATION_WAIT_FOR_REVIEW: TaskItemStatus.COMPLETED,
  EMP_VARIATION_APPLICATION_REVIEW: TaskItemStatus.UNDECIDED,
  EMP_VARIATION_WAIT_FOR_AMENDS: TaskItemStatus.UNDECIDED,
  EMP_VARIATION_APPLICATION_SUBMIT: TaskItemStatus.COMPLETED,
  EMP_ISSUANCE_WAIT_FOR_REVIEW: TaskItemStatus.COMPLETED,
};
