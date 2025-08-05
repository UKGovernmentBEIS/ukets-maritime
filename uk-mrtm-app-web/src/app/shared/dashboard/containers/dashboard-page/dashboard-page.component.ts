import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { combineLatest, distinctUntilChanged, filter, startWith, switchMap } from 'rxjs';

import { MrtmItemDTO } from '@mrtm/api';

import { AuthStore, selectUserRoleType } from '@netz/common/auth';
import { PageHeadingComponent } from '@netz/common/components';
import {
  DAYS_REMAINING_INPUT_TRANSFORMER,
  ITEM_LINK_REQUEST_TYPES_WHITELIST,
  ITEM_NAME_TRANSFORMER,
} from '@netz/common/pipes';
import { DestroySubject } from '@netz/common/services';
import {
  GovukTableColumn,
  LinkDirective,
  PaginationComponent,
  TabLazyDirective,
  TabsComponent,
} from '@netz/govuk-components';

import { requestTypesWhitelistForItemLinkPipe } from '@shared/constants';
import {
  DashboardItemsListComponent,
  DashboardStore,
  selectActiveTab,
  selectItems,
  selectPage,
  selectPageSize,
  selectTotal,
  WorkflowItemsAssignmentType,
  WorkflowItemsService,
} from '@shared/dashboard';
import { daysRemainingTransformer, taskActionTypeToTitleTransformer } from '@shared/utils';

const DEFAULT_TABLE_COLUMNS: GovukTableColumn<MrtmItemDTO>[] = [
  { field: 'taskType', header: 'Task', isSortable: false },
  { field: 'taskAssignee', header: 'Assigned to', isSortable: false },
  { field: 'daysRemaining', header: 'Days remaining', isSortable: false },
  { field: 'requestId', header: 'Workflow ID', isSortable: false },
  { field: 'accountName', header: 'Maritime operator', isSortable: false },
];

const getTableColumns = (activeTab: WorkflowItemsAssignmentType): GovukTableColumn<MrtmItemDTO>[] => {
  return DEFAULT_TABLE_COLUMNS.filter((column) => {
    return activeTab === 'assigned-to-others' || column.field !== 'taskAssignee';
  });
};

/* eslint-disable @angular-eslint/use-component-view-encapsulation */
@Component({
  selector: 'mrtm-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  providers: [
    DestroySubject,
    WorkflowItemsService,
    { provide: ITEM_NAME_TRANSFORMER, useValue: taskActionTypeToTitleTransformer },
    { provide: DAYS_REMAINING_INPUT_TRANSFORMER, useValue: daysRemainingTransformer },
    { provide: ITEM_LINK_REQUEST_TYPES_WHITELIST, useValue: requestTypesWhitelistForItemLinkPipe },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    PageHeadingComponent,
    TabsComponent,
    NgTemplateOutlet,
    DashboardItemsListComponent,
    LinkDirective,
    RouterLink,
    PaginationComponent,
    TabLazyDirective,
  ],
})
export class DashboardPageComponent implements OnInit {
  private readonly workflowItemsService = inject(WorkflowItemsService);
  private readonly dashboardStore = inject(DashboardStore);
  private readonly authStore = inject(AuthStore);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly destroy$ = inject(DestroyRef);

  role = this.authStore.select(selectUserRoleType);
  activeTab = this.dashboardStore.select(selectActiveTab);
  items = this.dashboardStore.select(selectItems);
  total = this.dashboardStore.select(selectTotal);
  page = this.dashboardStore.select(selectPage);
  pageSize = this.dashboardStore.select(selectPageSize);
  tableColumns = computed(() => getTableColumns(this.activeTab()));
  private readonly defaultAssignmentType: WorkflowItemsAssignmentType = 'assigned-to-me';
  private readonly activeTab$ = toObservable(this.activeTab);
  private readonly page$ = toObservable(this.page);

  ngOnInit(): void {
    this.activatedRoute.fragment
      .pipe(
        startWith(this.defaultAssignmentType),
        distinctUntilChanged(),
        filter((fragment) => !!fragment),
        takeUntilDestroyed(this.destroy$),
      )
      .subscribe((tab: WorkflowItemsAssignmentType) => {
        this.dashboardStore.setPage(1);
        this.dashboardStore.setActiveTab(this.isValidTab(tab) ? tab : this.defaultAssignmentType);
      });

    combineLatest([this.activeTab$, this.page$])
      .pipe(
        switchMap(([activeTab, page]) => {
          return this.workflowItemsService.getItems(activeTab, page, this.pageSize());
        }),
        takeUntilDestroyed(this.destroy$),
      )
      .subscribe(({ items, totalItems }) => {
        this.dashboardStore.setItems(items);
        this.dashboardStore.setTotal(totalItems);
      });
  }

  changePage(page: number) {
    this.dashboardStore.setPage(page);
  }

  /**
   * Check if tab is WorkflowItemsAssignmentType, as there are cases like having #main-content
   * @param tab
   */
  isValidTab(tab: WorkflowItemsAssignmentType) {
    return !(tab !== 'assigned-to-me' && tab !== 'assigned-to-others' && tab !== 'unassigned');
  }
}
