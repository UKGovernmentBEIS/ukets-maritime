import {
  EmissionsMonitoringPlan,
  EmpIssuanceSaveReviewGroupDecisionRequestTaskActionPayload,
  EmpVariationSaveReviewGroupDecisionRequestTaskActionPayload,
} from '@mrtm/api';

export const subtaskReviewGroupMap: Record<
  keyof EmissionsMonitoringPlan,
  | EmpIssuanceSaveReviewGroupDecisionRequestTaskActionPayload['reviewGroup']
  | EmpVariationSaveReviewGroupDecisionRequestTaskActionPayload['group']
> = {
  abbreviations: 'ABBREVIATIONS_AND_DEFINITIONS',
  additionalDocuments: 'ADDITIONAL_DOCUMENTS',
  controlActivities: 'CONTROL_ACTIVITIES',
  operatorDetails: 'MARITIME_OPERATOR_DETAILS',
  managementProcedures: 'MANAGEMENT_PROCEDURES',
  dataGaps: 'DATA_GAPS',
  emissions: 'SHIPS_CALCULATION_EMISSIONS',
  sources: 'EMISSION_SOURCES',
  greenhouseGas: 'MONITORING_APPROACH',
};
