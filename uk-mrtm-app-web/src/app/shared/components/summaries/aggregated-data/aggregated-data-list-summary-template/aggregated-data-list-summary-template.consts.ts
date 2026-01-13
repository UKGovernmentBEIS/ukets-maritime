import { GovukTableColumn } from '@netz/govuk-components';

import { AerAggregatedDataSummaryItemDto } from '@shared/types';

export const AGGREGATED_DATA_SUMMARY_COLUMNS: Array<GovukTableColumn<AerAggregatedDataSummaryItemDto>> = [
  { field: 'shipName', header: 'Ship name and IMO number', widthClass: 'app-column-width-20-per' },
  {
    field: 'totalShipEmissions',
    header: 'Total ship emissions (tCO2e)',
    isNumeric: true,
    widthClass: 'app-column-width-20-per',
  },
  {
    field: 'surrenderEmissions',
    header: 'Emissions figure for surrender  (tCO2e)',
    isNumeric: true,
    widthClass: 'app-column-width-20-per',
  },
  { field: 'dataInputType', header: 'Initial source', widthClass: 'app-column-width-20-per' },
  { field: 'status', header: 'Status', isSortable: true },
];
