import { MrtmItemDTO } from '@mrtm/api';

import { GovukTableColumn } from '@netz/govuk-components';

export const columns: GovukTableColumn<MrtmItemDTO>[] = [
  { field: 'taskType', header: 'Task', isSortable: true },
  { field: 'taskAssignee', header: 'Assigned to', isSortable: true },
  { field: 'daysRemaining', header: 'Days remaining', isSortable: true },
];

export const assignedItems: MrtmItemDTO[] = [
  {
    taskType: 'DUMMY_REQUEST_TASK_TYPE2',
    taskAssignee: { firstName: 'TEST_FN', lastName: 'TEST_LN' },
    daysRemaining: 10,
  },
];

export const unassignedItems = assignedItems.map((item) => ({ ...item, taskAssignee: null }));
