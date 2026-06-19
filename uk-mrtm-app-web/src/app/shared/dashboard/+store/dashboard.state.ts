import { MrtmItemDTO } from '@mrtm/api';

import { Paging } from '@shared/types';

export type WorkflowItemsAssignmentType = 'assigned-to-me' | 'assigned-to-others' | 'unassigned';

export interface DashboardState {
  activeTab: WorkflowItemsAssignmentType;
  items: MrtmItemDTO[];
  total: number;
  paging: Paging;
}

export const initialState: DashboardState = {
  activeTab: 'assigned-to-me',
  items: [],
  total: 0,
  paging: {
    page: 1,
    pageSize: 10,
  },
};
