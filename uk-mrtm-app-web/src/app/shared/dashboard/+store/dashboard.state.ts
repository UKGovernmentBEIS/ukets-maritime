import { MrtmItemDTO } from '@mrtm/api';

import { DashboardFiltersAndOrderBy } from '@shared/dashboard/components/dashboard-filters/dashboard-filters.types';
import { Paging } from '@shared/types';

export type WorkflowItemsAssignmentType = 'assigned-to-me' | 'assigned-to-others' | 'unassigned';

export interface DashboardState {
  activeTab: WorkflowItemsAssignmentType;
  items: MrtmItemDTO[];
  total: number;
  filters: DashboardFiltersAndOrderBy;
  paging: Paging;
}

export const initialState: DashboardState = {
  activeTab: 'assigned-to-me',
  items: [],
  total: 0,
  filters: {
    orderBy: 'NEWEST_FIRST',
  },
  paging: {
    page: 1,
    pageSize: 10,
  },
};
