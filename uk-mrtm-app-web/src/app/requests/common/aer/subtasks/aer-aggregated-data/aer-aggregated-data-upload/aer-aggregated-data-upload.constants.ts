import { GovukTableColumn } from '@netz/govuk-components';

import { AerAggregatedDataUploadDto } from '@shared/types';

export const aerAggregatedDataUploadTableXmlColumns: GovukTableColumn<AerAggregatedDataUploadDto>[] = [
  { field: 'imoNumber', header: 'IMO number', widthClass: 'govuk-!-width-one-third' },
  { field: 'name', header: 'Name', widthClass: 'govuk-!-width-two-thirds' },
];
