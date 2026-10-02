import { MiReportUserDefinedInfoDTO } from '@mrtm/api';

import { GovukTableColumn } from '@netz/govuk-components';

export const CUSTOM_REPORTS_LIST_COLUMNS: Array<GovukTableColumn<MiReportUserDefinedInfoDTO>> = [
  {
    field: 'reportName',
    header: 'Report name',
    isSortable: true,
    widthClass: 'app-column-width-30-per',
  },
  {
    field: 'categories',
    header: 'Category',
    widthClass: 'app-column-width-20-per',
  },
  {
    field: 'description',
    header: 'Description',
    widthClass: 'app-column-width-40-per',
  },
];
