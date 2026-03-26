import { DoeDeterminationReasonDetails, DoeTotalMaritimeEmissions } from '@mrtm/api';

export const determineReasonTypeMap: Record<DoeDeterminationReasonDetails['type'], string> = {
  VERIFIED_REPORT_NOT_SUBMITTED_IN_ACCORDANCE_WITH_ORDER: 'A report that was not submitted according to the Order',
  CORRECTING_NON_MATERIAL_MISSTATEMENT: 'Correcting a non-material misstatement',
  IMPOSING_OR_CONSIDERING_IMPOSING_CIVIL_PENALTY_IN_ACCORDANCE_WITH_ORDER:
    'Imposing or considering imposing a civil penalty according to the Order',
};

export const determineReasonTypeNoticeHintMap: Record<DoeDeterminationReasonDetails['noticeText'], string> = {
  VERIFIED_REPORT_NOT_SUBMITTED_IN_ACCORDANCE_WITH_ORDER:
    'Enter details of why the report was not in accordance with the Order. This text will be included in the Official Notice sent to the operator.<br /> For example: <br />because you failed to submit a report of maritime emissions by 31 March 2025 in accordance with Article 11 of the Order.',
  CORRECTING_NON_MATERIAL_MISSTATEMENT:
    'Enter details of why the report was not in accordance with the Order. This text will be included in the Official Notice sent to the operator.<br /> For example: <br />because your annual emissions report for the 2025 Scheme Year contained a non-material misstatement or misstatements that were not corrected before the issue of the related verification report.',
  IMPOSING_OR_CONSIDERING_IMPOSING_CIVIL_PENALTY_IN_ACCORDANCE_WITH_ORDER:
    'Enter details of why the report was not in accordance with the Order. This text will be included in the Official Notice sent to the operator.<br /> For example: <br />for the purpose of imposing, or considering whether to impose, a civil penalty under Article 11 of the Order.',
};

export const determinationTypeMap: Record<DoeTotalMaritimeEmissions['determinationType'], string> = {
  MARITIME_EMISSIONS: 'Maritime emissions and emissions figure for surrender',
  SURRENDER_OBLIGATION: 'Emissions figure for surrender',
};
