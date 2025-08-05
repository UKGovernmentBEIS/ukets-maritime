import { GovukTableColumn } from '@netz/govuk-components';

import { AerVoyageSummaryItemDto } from '@shared/types';

export const provideVoyagesSummaryColumns = (sortable: boolean): Array<GovukTableColumn<AerVoyageSummaryItemDto>> => [
  {
    field: 'imoNumber',
    header: 'IMO Number',
    isSortable: sortable,
    widthClass: 'app-column-width-15-per',
  },
  {
    field: 'departurePort',
    header: 'Port of departure',
  },
  {
    field: 'departureTime',
    header: 'Date and time of departure ',
  },
  {
    field: 'arrivalPort',
    header: 'Port of arrival',
  },
  {
    field: 'arrivalTime',
    header: 'Date and time of arrival',
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
    isSortable: sortable,
  },
];
