import { GovukTableColumn } from '@netz/govuk-components';

import { AerVoyageSummaryItemDto } from '@shared/types';

export const VOYAGES_SUMMARY_COLUMNS: Array<GovukTableColumn<AerVoyageSummaryItemDto>> = [
  {
    field: 'shipName',
    header: 'Ship name and IMO number',
    widthClass: 'app-column-width-20-per',
  },
  {
    field: 'departureTime',
    header: 'Departure details (port, country, date)',
  },
  {
    field: 'arrivalTime',
    header: 'Arrival details (port, country, date)',
  },
  {
    field: 'totalEmissions',
    header: 'Emissions from voyage (tCO2e)',
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
    isSortable: true,
  },
];
