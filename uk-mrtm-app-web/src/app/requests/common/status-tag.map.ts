import { TagColor } from '@netz/govuk-components';

import { TaskItemStatus } from '@requests/common/task-item-status';

type MrtmTaskStatusTagMap = Record<TaskItemStatus, { text: string; color: TagColor }>;

export const statusTagMap: MrtmTaskStatusTagMap = {
  NOT_STARTED: { text: 'Not started', color: 'grey' },
  CANCELLED: { text: 'Cancelled', color: 'grey' },
  CANNOT_START_YET: { text: 'Cannot start yet', color: 'grey' },
  COMPLETED: { text: 'Completed', color: 'green' },
  IN_PROGRESS: { text: 'In progress', color: 'light-blue' },
  ACCEPTED: { text: 'Accepted', color: 'green' },
  REJECTED: { text: 'Rejected', color: 'red' },
  UNDECIDED: { text: 'Undecided', color: 'grey' },
  AMENDS_NEEDED: { text: 'Operator to amend', color: 'light-blue' },
  OPERATOR_AMENDS_NEEDED: { text: 'Operator to amend', color: 'light-blue' },
  APPROVED: { text: 'Approved', color: 'green' },
  DEEMED_WITHDRAWN: { text: 'Withdrawn', color: 'red' },
  WITHDRAWN: { text: 'Withdrawn', color: 'red' },
  OPTIONAL: { text: 'Optional', color: 'grey' },
  NEEDS_REVIEW: { text: 'Needs review', color: 'yellow' },
  EXEMPT: { text: 'Exempt', color: 'red' },
  CLOSED: { text: 'Closed', color: 'grey' },
};
