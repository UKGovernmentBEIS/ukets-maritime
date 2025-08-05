import { GovukTableColumn } from '@netz/govuk-components';

import { AerAggregatedDataSummaryItemDto } from '@shared/types';

export const provideAerAggregatedDataColumns = (
  sortable: boolean,
): Array<GovukTableColumn<AerAggregatedDataSummaryItemDto>> => [
  { field: 'imoNumber', header: 'IMO number', isSortable: sortable },
  { field: 'shipName', header: 'Ship name' },
  { field: 'totalShipEmissions', header: 'Total ship emissions (tCO2e)', isNumeric: true },
  { field: 'surrenderEmissions', header: 'Emissions figure for surrender  (tCO2e)', isNumeric: true },
  { field: 'status', header: 'Status', isSortable: sortable },
];
