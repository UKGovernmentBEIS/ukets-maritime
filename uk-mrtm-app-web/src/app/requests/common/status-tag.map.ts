import { TaskStatusTag } from '@netz/common/pipes';

import { TaskItemStatus } from '@requests/common/task-item-status';

type MrtmTaskStatusTagMap = Record<TaskItemStatus, TaskStatusTag>;

export const statusTagMap: MrtmTaskStatusTagMap = {
  NOT_STARTED: { text: 'Not started', color: 'blue', style: 'fill' },
  CANCELLED: { text: 'Cancelled', color: 'grey', style: 'fill' },
  CANNOT_START_YET: { text: 'Cannot start yet', color: 'grey', style: 'tinted' },
  COMPLETED: { text: 'Completed', color: 'green', style: 'none' },
  IN_PROGRESS: { text: 'In progress', color: 'teal', style: 'fill' },
  ACCEPTED: { text: 'Accepted', color: 'green', style: 'none' },
  REJECTED: { text: 'Rejected', color: 'red', style: 'fill' },
  UNDECIDED: { text: 'Undecided', color: 'blue', style: 'fill' },
  AMENDS_NEEDED: { text: 'Operator to amend', color: 'yellow', style: 'fill' },
  OPERATOR_AMENDS_NEEDED: { text: 'Operator to amend', color: 'yellow', style: 'fill' },
  APPROVED: { text: 'Approved', color: 'green', style: 'none' },
  DEEMED_WITHDRAWN: { text: 'Withdrawn', color: 'orange', style: 'fill' },
  WITHDRAWN: { text: 'Withdrawn', color: 'orange', style: 'fill' },
  OPTIONAL: { text: 'Optional', color: 'grey', style: 'fill' },
  NEEDS_REVIEW: { text: 'Needs review', color: 'yellow', style: 'fill' },
  EXEMPT: { text: 'Exempt', color: 'grey', style: 'fill' },
  CLOSED: { text: 'Closed', color: 'grey', style: 'fill' },
};
