import { GovukTableColumn } from '@netz/govuk-components';

import { AerVoyageOrPortCalculationsSummaryItemDto } from '@shared/types';

export const VOYAGE_OR_PORT_CALL_EMISSIONS_SUMMARY_COLUMNS: Array<
  GovukTableColumn<AerVoyageOrPortCalculationsSummaryItemDto>
> = [
  { field: 'emission', header: 'Emissions' },
  { field: 'co2', header: 'CO2 emissions (t)' },
  { field: 'ch4', header: 'CH4 emissions (tCO2e)' },
  { field: 'n2o', header: 'N2O emissions (tCO2e)' },
  { field: 'total', header: 'Total emissions (tCO2e)' },
];
