import { VerificationBodyDTO } from '@mrtm/api';

import { GovukSelectOption, GovukTableColumn } from '@netz/govuk-components';

export const VERIFICATION_BODIES_LIST_COLUMNS: GovukTableColumn[] = [
  { field: 'name', header: 'Verification body name' },
  { field: 'status', header: 'Account status' },
  { field: 'deleteBtn', header: 'Actions', hiddenHeader: true },
];

export const VERIFICATION_BODY_STATUSES: GovukSelectOption<VerificationBodyDTO['status']>[] = [
  { text: 'Active', value: 'ACTIVE' },
  { text: 'Disabled', value: 'DISABLED' },
];
