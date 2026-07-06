import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, inject, linkedSignal, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { map, switchMap, tap } from 'rxjs';

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

import { AutocompleteSelectOption } from '@shared/components';
import { requestTypesWhitelistForItemLinkPipe } from '@shared/constants';
import {
  DashboardStore,
  initialDashboardFiltersAndOrderByState,
  initialState,
  selectFilters,
  WorkflowItemsAssignmentType,
} from '@shared/dashboard/+store';
import { DashboardFiltersComponent } from '@shared/dashboard/components/dashboard-filters';
import { DashboardItemsListComponent } from '@shared/dashboard/components/dashboard-items-list';
import { WorkflowItemsService } from '@shared/dashboard/services';
import { MrtmRequestType } from '@shared/types';
import { daysRemainingTransformer, isEqual, taskActionTypeToTitleTransformer } from '@shared/utils';

const DEFAULT_TABLE_COLUMNS: GovukTableColumn<MrtmItemDTO>[] = [
  { field: 'taskType', header: 'Task', isSortable: false },
  { field: 'taskAssignee', header: 'Assigned to', isSortable: false, widthClass: 'app-column-width-15-per' },
  { field: 'daysRemaining', header: 'Days remaining', isSortable: false, widthClass: 'app-column-width-15-per' },
  { field: 'requestId', header: 'Workflow ID', isSortable: false, widthClass: 'app-column-width-20-per' },
  { field: 'accountName', header: 'Maritime operator', isSortable: false, widthClass: 'app-column-width-15-per' },
];

const getTableColumns = (activeTab: WorkflowItemsAssignmentType): GovukTableColumn<MrtmItemDTO>[] => {
  return DEFAULT_TABLE_COLUMNS.filter((column) => {
    return activeTab === 'assigned-to-others' || column.field !== 'taskAssignee';
  });
};

@Component({
  selector: 'mrtm-dashboard-page',
  imports: [
    PageHeadingComponent,
    TabsComponent,
    NgTemplateOutlet,
    DashboardItemsListComponent,
    LinkDirective,
    RouterLink,
    PaginationComponent,
    TabLazyDirective,
    DashboardFiltersComponent,
  ],
  standalone: true,
  templateUrl: './dashboard-page.component.html',
  providers: [
    DestroySubject,
    WorkflowItemsService,
    { provide: ITEM_NAME_TRANSFORMER, useValue: taskActionTypeToTitleTransformer },
    { provide: DAYS_REMAINING_INPUT_TRANSFORMER, useValue: daysRemainingTransformer },
    { provide: ITEM_LINK_REQUEST_TYPES_WHITELIST, useValue: requestTypesWhitelistForItemLinkPipe },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPageComponent {
  private readonly workflowItemsService = inject(WorkflowItemsService);

  private readonly authStore = inject(AuthStore);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly store = inject(DashboardStore);

  readonly filters = this.store.select(selectFilters);
  readonly isLoading = signal<boolean>(false);
  readonly hasAppliedFilters = computed<boolean>(
    () => !isEqual(this.filters(), initialDashboardFiltersAndOrderByState),
  );
  pageSize = initialState.paging.pageSize;
  role = this.authStore.select(selectUserRoleType);
  readonly activeTab = signal(
    this.isValidTab(this.activatedRoute.snapshot.fragment as any)
      ? (this.activatedRoute.snapshot.fragment as WorkflowItemsAssignmentType)
      : initialState.activeTab,
  );
  readonly page = linkedSignal<MrtmRequestType, number>({
    source: computed(() => this.filters().workflowType),
    computation: (_, previous) => {
      if (previous) {
        return initialState.paging.page;
      }

      const initialPage = this.activatedRoute.snapshot.queryParamMap.get('page');
      return initialPage ? +initialPage : initialState.paging.page;
    },
  });
  readonly tableColumns = computed(() => getTableColumns(this.activeTab()));
  private readonly params = computed(() => ({
    activeTab: this.activeTab(),
    page: this.page(),
  }));

  readonly relatedAccounts = toSignal(
    this.workflowItemsService.getRelatedAccounts().pipe(
      map((accounts) =>
        accounts.map<AutocompleteSelectOption>((account) => ({
          data: account.businessId,
          text: `${account.name} (ID: ${account.businessId})`,
        })),
      ),
    ),
    {
      initialValue: [],
    },
  );

  private readonly response = toSignal(
    toObservable(
      computed(() => ({
        params: this.params(),
        filters: this.filters(),
      })),
    ).pipe(
      tap(() => this.isLoading.set(true)),
      switchMap(({ params: { activeTab, page }, filters }) =>
        this.workflowItemsService
          .getItems(
            activeTab,
            page,
            this.pageSize,
            filters?.orderBy ?? 'NEWEST_FIRST',
            filters.accountId?.data,
            filters.workflowType,
          )
          .pipe(tap(() => this.isLoading.set(false))),
      ),
    ),
    {
      initialValue: {
        items: initialState.items,
        totalItems: initialState.total,
      },
    },
  );
  readonly items = computed(() => (this.isLoading() ? [] : this.response().items));
  readonly total = computed(() => this.response().totalItems);

  readonly emptyTableText = computed(() =>
    this.isLoading()
      ? ''
      : this.hasAppliedFilters()
        ? `<h4 class="govuk-heading-s">There are no matching results.</h4>
      <p class="govuk-body">Improve your search by:</p>
      <ul class="govuk-list govuk-list--bullet">
        <li>removing filters</li>
        <li>double-checking your spelling</li>
        <li>using fewer keywords</li>
        <li>searching for something less specific</li>
      </ul>`
        : 'No tasks found',
  );

  /**
   * The pagination component reads the current page from the 'page' query param,
   * so the URL must follow the 'page' signal when a filter change resets it.
   */
  constructor() {
    effect(() => {
      const page = this.page();
      const urlPage = this.activatedRoute.snapshot.queryParamMap.get('page');
      const resolvedPage = urlPage ? +urlPage : initialState.paging.page;

      if (page !== resolvedPage) {
        this.router.navigate([], {
          relativeTo: this.activatedRoute,
          queryParams: { page },
          fragment: this.activatedRoute.snapshot.fragment,
        });
      }
    });
  }

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
