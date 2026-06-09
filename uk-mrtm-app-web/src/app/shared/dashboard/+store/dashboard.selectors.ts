import { MrtmItemDTO } from '@mrtm/api';

import { createDescendingSelector, createSelector, StateSelector } from '@netz/common/store';

import { DashboardState, WorkflowItemsAssignmentType } from '@shared/dashboard/+store/dashboard.state';
import { DashboardFiltersAndOrderBy } from '@shared/dashboard/components/dashboard-filters/dashboard-filters.types';
import { Paging } from '@shared/types';

export const selectActiveTab: StateSelector<DashboardState, WorkflowItemsAssignmentType> = createSelector(
  (state) => state.activeTab,
);

export const selectItems: StateSelector<DashboardState, MrtmItemDTO[]> = createSelector((state) => state.items);

export const selectTotal: StateSelector<DashboardState, number> = createSelector((state) => state.total);

export const selectPaging: StateSelector<DashboardState, Paging> = createSelector((state) => state.paging);

export const selectPage: StateSelector<DashboardState, number> = createDescendingSelector(
  selectPaging,
  (state) => state.page,
);

export const selectFilters: StateSelector<DashboardState, DashboardFiltersAndOrderBy> = createSelector(
  (state) => state.filters,
);

export const selectPageSize: StateSelector<DashboardState, number> = createDescendingSelector(
  selectPaging,
  (state) => state.pageSize,
);
