import { GovukTableColumn } from '@netz/govuk-components';

import { AerPortSummaryItemDto } from '@shared/types';

export const PORTS_SUMMARY_COLUMNS: Array<GovukTableColumn<AerPortSummaryItemDto>> = [
  {
    field: 'shipName',
    header: 'Ship name and IMO number',
    widthClass: 'app-column-width-20-per',
  },
  {
    field: 'arrivalTime',
    header: 'Arrival details (port, country, date)',
  },
  {
    field: 'departureTime',
    header: 'Departure details (port, country, date)',
  },
  {
    field: 'totalEmissions',
    header: 'Emissions while in port (tCO2e)',
    isNumeric: true,
  },
  {
    field: 'surrenderEmissions',
    header: 'Emissions figure for surrender (tCO2e)',
    isNumeric: true,
  },
  {
    isHeader: true,
    field: 'status',
    header: 'Status',
    widthClass: 'app-column-width-15-per',
    isSortable: true,
  },
];
