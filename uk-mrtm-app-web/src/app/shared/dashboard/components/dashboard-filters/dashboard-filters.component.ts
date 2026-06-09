import { ChangeDetectionStrategy, Component, computed, inject, input, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { AuthStore, selectUserRoleType } from '@netz/common/auth';
import { ButtonDirective, DetailsComponent, LinkDirective, SelectComponent } from '@netz/govuk-components';

import { AutocompleteSelectComponent, AutocompleteSelectOption } from '@shared/components';
import { DashboardStore, selectFilters } from '@shared/dashboard/+store';
import {
  INITIAL_FILTERS,
  ORDER_BY_FILTER_ITEMS,
  WORKFLOW_FILTER_ITEMS,
} from '@shared/dashboard/components/dashboard-filters/dashboard-filters.consts';
import {
  DashboardFiltersAndOrderBy,
  DashboardFiltersFormGroupModel,
} from '@shared/dashboard/components/dashboard-filters/dashboard-filters.types';
import { isEqual } from '@shared/utils';

@Component({
  selector: 'mrtm-dashboard-filters',
  imports: [
    ReactiveFormsModule,
    SelectComponent,
    AutocompleteSelectComponent,
    ButtonDirective,
    DetailsComponent,
    LinkDirective,
    RouterLink,
  ],
  templateUrl: './dashboard-filters.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardFiltersComponent implements OnInit {
  private readonly store = inject(DashboardStore);
  private readonly authStore = inject(AuthStore);

  readonly accounts = input<Array<AutocompleteSelectOption>>([]);
  readonly initialState = input<DashboardFiltersAndOrderBy>({
    orderBy: 'NEWEST_FIRST',
    workflowType: null,
  });

  protected readonly formGroup = new FormGroup<DashboardFiltersFormGroupModel>({
    accountId: new FormControl<AutocompleteSelectOption | null>(this.initialState()?.accountId),
    workflowType: new FormControl<DashboardFiltersAndOrderBy['workflowType'] | null>(this.initialState()?.workflowType),
    orderBy: new FormControl<DashboardFiltersAndOrderBy['orderBy'] | null>(this.initialState()?.orderBy),
  });

  protected readonly workflowFilterItems = computed(() => {
    return (WORKFLOW_FILTER_ITEMS[this.authStore.select(selectUserRoleType)()] ?? []).sort((a, b) => {
      if (a.value === null) return -1;
      if (b.value === null) return 1;
      return a.text.localeCompare(b.text, 'en-GB', { sensitivity: 'base' });
    });
  });

  protected readonly orderByFilterItems = ORDER_BY_FILTER_ITEMS;
  protected readonly hasAppliedFilters = computed<boolean>(
    () => !isEqual(this.store.select(selectFilters)(), INITIAL_FILTERS),
  );

  protected readonly accountsSuggestions = computed(() => {
    return (this.accounts() ?? []).sort((a, b) => a.text.localeCompare(b.text, 'en-GB', { sensitivity: 'base' }));
  });

  ngOnInit(): void {
    this.formGroup.patchValue(this.initialState());
  }

  onSubmit() {
    if (!this.formGroup.dirty) {
      return;
    }

    const { accountId, workflowType, orderBy } = this.formGroup.value;

    this.store.setFilters({
      accountId,
      workflowType,
      orderBy,
    });
  }

  onClearFiltersClick(): void {
    this.formGroup.reset(INITIAL_FILTERS);
    this.store.setFilters(INITIAL_FILTERS);
  }
}
