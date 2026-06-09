import { Injectable } from '@angular/core';

import { produce } from 'immer';

import { ItemDTO } from '@mrtm/api';

import { SignalStore } from '@netz/common/store';

import { DashboardState, initialState, WorkflowItemsAssignmentType } from '@shared/dashboard/+store/dashboard.state';
import { DashboardFiltersAndOrderBy } from '@shared/dashboard/components/dashboard-filters/dashboard-filters.types';

@Injectable({ providedIn: 'root' })
export class DashboardStore extends SignalStore<DashboardState> {
  constructor() {
    super(initialState);
  }

  setActiveTab(activeTab: WorkflowItemsAssignmentType) {
    this.setState(
      produce(this.state, (state) => {
        state.activeTab = activeTab;
      }),
    );
  }

  setItems(items: ItemDTO[]) {
    this.setState(
      produce(this.state, (state) => {
        state.items = items;
      }),
    );
  }

  setTotal(total: number) {
    this.setState(
      produce(this.state, (state) => {
        state.total = total;
      }),
    );
  }

  setPage(page: number) {
    this.setState(
      produce(this.state, (state) => {
        state.paging = { ...this.state.paging, page };
      }),
    );
  }

  setFilters(filters: DashboardFiltersAndOrderBy) {
    this.setState(
      produce(this.state, (state) => {
        state.filters = filters;
      }),
    );
  }
}
