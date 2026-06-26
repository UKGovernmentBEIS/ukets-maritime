import { AccountSearchResultInfoDTO, MrtmItemDTO } from '@mrtm/api';

import { AutocompleteSelectOption } from '@shared/components';
import { MrtmRequestType, Paging } from '@shared/types';

export type WorkflowItemsAssignmentType = 'assigned-to-me' | 'assigned-to-others' | 'unassigned';

export interface DashboardFiltersAndOrderBy {
  accountId?: AutocompleteSelectOption<AccountSearchResultInfoDTO['businessId']>;
  workflowType?: MrtmRequestType;
  orderBy: 'NEWEST_FIRST' | 'NEAREST_DUE_DATE';
}

export interface DashboardState {
  activeTab: WorkflowItemsAssignmentType;
  items: MrtmItemDTO[];
  total: number;
  filters: DashboardFiltersAndOrderBy;
  paging: Paging;
}

export const initialDashboardFiltersAndOrderByState: DashboardFiltersAndOrderBy = {
  accountId: null,
  workflowType: null,
  orderBy: 'NEWEST_FIRST',
};

export const initialState: DashboardState = {
  activeTab: 'assigned-to-me',
  items: [],
  total: 0,
  filters: initialDashboardFiltersAndOrderByState,
  paging: {
    page: 1,
    pageSize: 10,
  },
};
