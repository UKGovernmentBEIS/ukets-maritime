import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

import { AuthStore, selectUserRoleType } from '@netz/common/auth';
import { ButtonDirective, DetailsComponent, LinkDirective, SelectComponent } from '@netz/govuk-components';

import { TASK_FORM } from '@requests/common';
import { AutocompleteSelectComponent, AutocompleteSelectOption } from '@shared/components';
import { DashboardStore, initialDashboardFiltersAndOrderByState, selectFilters } from '@shared/dashboard/+store';
import {
  ORDER_BY_FILTER_ITEMS,
  WORKFLOW_FILTER_ITEMS,
} from '@shared/dashboard/components/dashboard-filters/dashboard-filters.consts';
import { dashboardFiltersFormProvider } from '@shared/dashboard/components/dashboard-filters/dashboard-filters.form-provider';
import { DashboardFiltersFormGroupModel } from '@shared/dashboard/components/dashboard-filters/dashboard-filters.types';
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
  ],
  templateUrl: './dashboard-filters.component.html',
  providers: [dashboardFiltersFormProvider],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardFiltersComponent {
  protected readonly formGroup: FormGroup<DashboardFiltersFormGroupModel> = inject(TASK_FORM);
  private readonly store = inject(DashboardStore);
  private readonly authStore = inject(AuthStore);

  readonly accounts = input<Array<AutocompleteSelectOption>>([]);

  protected readonly workflowFilterItems = computed(() => {
    return (WORKFLOW_FILTER_ITEMS[this.authStore.select(selectUserRoleType)()] ?? []).sort((a, b) => {
      if (a.value === null) return -1;
      if (b.value === null) return 1;
      return a.text.localeCompare(b.text, 'en-GB', { sensitivity: 'base' });
    });
  });

  protected readonly orderByFilterItems = ORDER_BY_FILTER_ITEMS;
  protected readonly hasAppliedFilters = computed<boolean>(
    () => !isEqual(this.store.select(selectFilters)(), initialDashboardFiltersAndOrderByState),
  );

  protected readonly accountsSuggestions = computed(() => {
    return (this.accounts() ?? []).sort((a, b) => a.text.localeCompare(b.text, 'en-GB', { sensitivity: 'base' }));
  });

  onSubmit() {
    if (!this.formGroup.dirty) {
      return;
    }

    const { accountId, workflowType, orderBy } = this.formGroup.value;

    this.store.setFilters({
      accountId: accountId?.data ? accountId : null,
      workflowType,
      orderBy,
    });
  }

  onClearFiltersClick(): void {
    this.formGroup.reset(initialDashboardFiltersAndOrderByState);
    this.store.setFilters(initialDashboardFiltersAndOrderByState);
  }
}
