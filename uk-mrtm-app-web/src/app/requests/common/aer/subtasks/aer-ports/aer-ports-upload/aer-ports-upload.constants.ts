import { GovukTableColumn } from '@netz/govuk-components';

import { AerPortUploadCsvDto } from '@shared/types/aer-port-upload-csv-dto.interface';

export const uploadPortsCsvColumns: GovukTableColumn<AerPortUploadCsvDto>[] = [
  {
    field: 'imoNumber',
    header: 'IMO number',
  },
  {
    field: 'country',
    header: 'Country code and name',
  },
  {
    field: 'port',
    header: 'Port code and name',
  },
  {
    field: 'arrivalTime',
    header: 'Date and time of arrival',
  },
  {
    field: 'departureTime',
    header: 'Date and time of departure',
  },
];
