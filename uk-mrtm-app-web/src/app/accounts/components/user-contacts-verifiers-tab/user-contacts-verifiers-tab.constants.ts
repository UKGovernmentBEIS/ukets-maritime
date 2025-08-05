import { UserAuthorityInfoDTO } from '@mrtm/api';

import { GovukSelectOption } from '@netz/govuk-components';

export const editableCols = [
  { field: 'name', header: 'Name', isSortable: true },
  { field: 'roleName', header: 'User Type', widthClass: 'app-column-width-20-per' },
  { field: 'PRIMARY', header: 'Primary contact' },
  { field: 'SECONDARY', header: 'Secondary contact' },
  { field: 'SERVICE', header: 'Service contact' },
  { field: 'FINANCIAL', header: 'Financial contact' },
  { field: 'authorityStatus', header: 'Account status', widthClass: 'app-column-width-15-per' },
  { field: 'deleteBtn', header: undefined },
];

export const userTypeOptions: GovukSelectOption<string>[] = [
  { text: 'Operator admin', value: 'operator_admin' },
  { text: 'Operator', value: 'operator' },
];

export const authorityStatusOptions: GovukSelectOption<UserAuthorityInfoDTO['authorityStatus']>[] = [
  { text: 'Active', value: 'ACTIVE' },
  { text: 'Disabled', value: 'DISABLED' },
];

export const authorityStatusAcceptedOptions: GovukSelectOption<UserAuthorityInfoDTO['authorityStatus']>[] = [
  { text: 'Accepted', value: 'ACCEPTED' },
  { text: 'Active', value: 'ACTIVE' },
];
