import { GovukTableColumn } from '@netz/govuk-components';

import { AerAggregatedDataSummaryItemDto } from '@shared/types';

export const AGGREGATED_DATA_SUMMARY_COLUMNS: Array<GovukTableColumn<AerAggregatedDataSummaryItemDto>> = [
  { field: 'shipName', header: 'Ship name and IMO number' },
  { field: 'totalShipEmissions', header: 'Total ship emissions (tCO2e)', isNumeric: true },
  { field: 'surrenderEmissions', header: 'Emissions figure for surrender  (tCO2e)', isNumeric: true },
  { field: 'status', header: 'Status', isSortable: true },
];
