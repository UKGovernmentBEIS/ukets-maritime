import { GovukTableColumn } from '@netz/govuk-components';

import { AerPortSummaryItemDto } from '@shared/types';

export const PORTS_SUMMARY_COLUMNS: Array<GovukTableColumn<AerPortSummaryItemDto>> = [
  {
    field: 'imoNumber',
    header: 'IMO Number',
    isSortable: true,
    widthClass: 'app-column-width-15-per',
  },
  {
    field: 'country',
    header: 'Country code and name',
  },
  {
    field: 'port',
    header: 'Port code and name ',
  },
  {
    field: 'arrivalTime',
    header: 'Date and time of arrival',
  },
  {
    field: 'departureTime',
    header: 'Date and time of departure ',
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
