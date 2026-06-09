import { GovukSelectOption } from '@netz/govuk-components';

import { DashboardFiltersAndOrderBy } from '@shared/dashboard/components/dashboard-filters/dashboard-filters.types';

export const WORKFLOW_FILTER_ITEMS: Record<
  'OPERATOR' | 'REGULATOR' | 'VERIFIER',
  Array<GovukSelectOption<DashboardFiltersAndOrderBy['workflowType']>>
> = {
  REGULATOR: [
    { value: null, text: 'All workflows' },
    { value: 'ACCOUNT_CLOSURE', text: 'Account closure' },
    { value: 'AER', text: 'Annual emission report' },
    { value: 'EMP_ISSUANCE', text: 'Emission monitoring plan' },
    { value: 'EMP_VARIATION', text: 'Emission monitoring plan variation' },
    { value: 'DOE', text: 'Determination of emissions' },
    { value: 'VIR', text: 'Verifier improvement report' },
    { value: 'NON_COMPLIANCE', text: 'Non-compliance' },
  ],
  OPERATOR: [
    { value: null, text: 'All workflows' },
    { value: 'AER', text: 'Annual emission report' },
    { value: 'EMP_ISSUANCE', text: 'Emission monitoring plan' },
    { value: 'EMP_VARIATION', text: 'Emission monitoring plan variation' },
    { value: 'VIR', text: 'Verifier improvement report' },
  ],
  VERIFIER: [
    { value: null, text: 'All workflows' },
    { value: 'AER', text: 'Annual emission report' },
  ],
};

export const ORDER_BY_FILTER_ITEMS: Array<GovukSelectOption<DashboardFiltersAndOrderBy['orderBy']>> = [
  { value: 'NEWEST_FIRST', text: 'Newest first' },
  { value: 'NEAREST_DUE_DATE', text: 'Days remaining' },
];

export const INITIAL_FILTERS: DashboardFiltersAndOrderBy = {
  orderBy: 'NEWEST_FIRST',
};
