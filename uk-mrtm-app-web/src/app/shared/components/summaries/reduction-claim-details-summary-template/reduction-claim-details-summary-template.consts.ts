import { GovukTableColumn } from '@netz/govuk-components';

import { ReductionClaimDetailsListItemDto } from '@shared/types';

export const provideReductionClaimDetailsSummaryColumns = (
  editable: boolean,
): Array<GovukTableColumn<ReductionClaimDetailsListItemDto & { actions: unknown }>> =>
  [
    { field: 'fuelOriginTypeName', header: 'Fuel name', widthClass: 'app-column-width-20-per' },
    { field: 'batchNumber', header: 'Batch number', isNumeric: true },
    { field: 'smfMass', header: 'Mass of fuel', isNumeric: true },
    { field: 'co2EmissionFactor', header: 'CO2 EF t/t', isNumeric: true },
    { field: 'co2Emissions', header: 'CO2 emissions (t)', isNumeric: true },
    { field: 'evidenceFiles', header: 'Supporting evidence' },
    editable ? { field: 'actions', header: undefined } : undefined,
  ].filter(Boolean) as Array<GovukTableColumn<ReductionClaimDetailsListItemDto>>;
