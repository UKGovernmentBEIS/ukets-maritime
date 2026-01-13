import { UserAuthorityInfoDTO } from '@mrtm/api';

import { GovukSelectOption, GovukTableColumn } from '@netz/govuk-components';

export const VERIFIER_USERS_LIST_COLUMNS: GovukTableColumn[] = [
  { field: 'name', header: 'Name', isSortable: true },
  { field: 'roleCode', header: 'User type' },
  { field: 'authorityStatus', header: 'Account status' },
  { field: 'deleteBtn', header: 'Actions', hiddenHeader: true },
];

export const VERIFIER_USER_STATUSES: GovukSelectOption<UserAuthorityInfoDTO['authorityStatus']>[] = [
  { text: 'Active', value: 'ACTIVE' },
  { text: 'Disabled', value: 'DISABLED' },
];

export const VERIFIER_USER_STATUSES_ACCEPTED: GovukSelectOption<UserAuthorityInfoDTO['authorityStatus']>[] = [
  { text: 'Accepted', value: 'ACCEPTED' },
  { text: 'Active', value: 'ACTIVE' },
];

export const VERIFIER_USER_TYPES: GovukSelectOption<UserAuthorityInfoDTO['roleCode']>[] = [
  { text: 'Verifier admin', value: 'verifier_admin' },
  { text: 'Verifier', value: 'verifier' },
];
