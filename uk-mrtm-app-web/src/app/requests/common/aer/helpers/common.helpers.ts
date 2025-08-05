import { TaskItemStatus } from '@requests/common/task-item-status';

export const selectStatusForSubtask = (
  subtask: string,
  sectionsCompleted?: { [key: string]: string },
  defaultStatus: TaskItemStatus = TaskItemStatus.NOT_STARTED,
): TaskItemStatus => {
  const taskStatus = sectionsCompleted?.[subtask] as TaskItemStatus;
  return taskStatus ?? defaultStatus;
};
