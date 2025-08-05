import { DoeDeterminationReason, DoeTotalMaritimeEmissions } from '@mrtm/api';

export const determineReasonTypeMap: Record<DoeDeterminationReason['type'], string> = {
  VERIFIED_REPORT_NOT_SUBMITTED_IN_ACCORDANCE_WITH_ORDER: 'A report that was not submitted according to the Order',
  CORRECTING_NON_MATERIAL_MISSTATEMENT: 'Correcting a non-material misstatement',
  IMPOSING_OR_CONSIDERING_IMPOSING_CIVIL_PENALTY_IN_ACCORDANCE_WITH_ORDER:
    'Imposing or considering imposing a civil penalty according to the Order',
};

export const determinationTypeMap: Record<DoeTotalMaritimeEmissions['determinationType'], string> = {
  MARITIME_EMISSIONS: 'Maritime emissions and emissions figure for surrender',
  SURRENDER_OBLIGATION: 'Emissions figure for surrender',
};
