import { GovukTableColumn } from '@netz/govuk-components';

import { AerAggregatedDataEmissionDto } from '@shared/types';

export const provideAggregatedDataEmissionsSummaryColumns = (
  showEmissionsHeader: boolean,
): Array<GovukTableColumn<AerAggregatedDataEmissionDto>> =>
  [
    { field: 'emission', header: showEmissionsHeader ? 'Emissions' : undefined, widthClass: 'app-column-width-20-per' },
    { field: 'co2', header: 'CO2 emissions (t)', widthClass: 'app-column-width-15-per', isNumeric: true },
    { field: 'ch4', header: 'CH4 emissions (tCO2e)', widthClass: 'app-column-width-15-per', isNumeric: true },
    { field: 'n2o', header: 'N2O emissions (tCO2e)', widthClass: 'app-column-width-15-per', isNumeric: true },
    { field: 'total', header: 'Total emissions (tCO2e)', widthClass: 'app-column-width-15-per', isNumeric: true },
  ].filter(Boolean) as Array<GovukTableColumn<AerAggregatedDataEmissionDto>>;
