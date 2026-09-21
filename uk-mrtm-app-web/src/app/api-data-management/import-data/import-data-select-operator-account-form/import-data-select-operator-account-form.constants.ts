import { ThirdPartyDataManagementAvailableToImportItem } from '@mrtm/api';

import { GovukTableColumn } from '@netz/govuk-components';

export const SELECTED_ACCOUNTS_COLUMNS: Array<GovukTableColumn<ThirdPartyDataManagementAvailableToImportItem>> = [
  {
    header: 'Operator name',
    field: 'name',
  },
  {
    header: 'IMO Number',
    field: 'imoNumber',
  },
  {
    header: 'Data supplier',
    field: 'providerName',
  },
];
