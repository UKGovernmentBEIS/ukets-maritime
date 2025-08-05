import { GovukTableColumn } from '@netz/govuk-components';

import { AerVoyageUploadCsvDto } from '@shared/types';

export const uploadVoyagesCsvColumns: GovukTableColumn<AerVoyageUploadCsvDto>[] = [
  {
    field: 'imoNumber',
    header: 'IMO Number',
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
];
