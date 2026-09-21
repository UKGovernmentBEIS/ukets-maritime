import { ThirdPartyDataManagementAvailableToImportItem } from '@mrtm/api';

import { GovukTableColumn } from '@netz/govuk-components';

export const AVAILABLE_TO_IMPORT_COLUMNS: Array<GovukTableColumn<ThirdPartyDataManagementAvailableToImportItem>> = [
  {
    header: 'Operator name',
    field: 'name',
    isSortable: true,
  },
  {
    header: 'IMO Number',
    field: 'imoNumber',
  },
  {
    header: 'Tasks',
    field: 'itemType',
    isSortable: true,
  },
  {
    header: 'Data supplier',
    field: 'providerName',
  },
  {
    header: 'Date data received',
    field: 'receivedOn',
  },
];

export const AVAILABLE_TO_IMPORT_COLUMN_SORT_MAP: Record<string, 'OPERATOR_NAME' | 'TASK'> = {
  name: 'OPERATOR_NAME',
  itemType: 'TASK',
};
