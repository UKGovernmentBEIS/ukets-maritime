import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { switchMap } from 'rxjs';

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
  initialState,
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
export class DashboardPageComponent {
  private readonly workflowItemsService = inject(WorkflowItemsService);
  private readonly authStore = inject(AuthStore);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);

  pageSize = initialState.paging.pageSize;
  role = this.authStore.select(selectUserRoleType);
  activeTab = signal(
    this.isValidTab(this.activatedRoute.snapshot.fragment as any)
      ? (this.activatedRoute.snapshot.fragment as WorkflowItemsAssignmentType)
      : initialState.activeTab,
  );
  page = signal(
    this.activatedRoute.snapshot.queryParamMap.get('page')
      ? +this.activatedRoute.snapshot.queryParamMap.get('page')
      : initialState.paging.page,
  );
  readonly tableColumns = computed(() => getTableColumns(this.activeTab()));
  private readonly params = computed(() => ({
    activeTab: this.activeTab(),
    page: this.page(),
  }));
  private readonly response = toSignal(
    toObservable(this.params).pipe(
      switchMap(({ activeTab, page }) => this.workflowItemsService.getItems(activeTab, page, this.pageSize)),
    ),
    {
      initialValue: {
        items: initialState.items,
        totalItems: initialState.total,
      },
    },
  );
  items = computed(() => this.response().items);
  total = computed(() => this.response().totalItems);

  changePage(page: number) {
    this.page.update(() => page);
  }

  selectTab(selected: string) {
    if (selected !== this.activeTab()) {
      this.router.navigate([], {
        relativeTo: this.activatedRoute,
        queryParams: { page: 1 },
        fragment: selected,
      });
      this.page.update(() => 1);
      this.activeTab.update(() => selected as WorkflowItemsAssignmentType);
    }
  }

  /**
   * Check if tab is WorkflowItemsAssignmentType, as there are cases like having #main-content
   * @param tab
   */
  isValidTab(tab: WorkflowItemsAssignmentType) {
    return ['assigned-to-me', 'assigned-to-others', 'unassigned'].includes(tab);
  }
}
