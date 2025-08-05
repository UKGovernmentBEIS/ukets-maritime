import { EmissionsMonitoringPlan } from '@mrtm/api';

export const empSubtaskToTitle: Record<keyof EmissionsMonitoringPlan | string, string> = {
  operatorDetails: 'Operator details',
  emissions: 'List of ships and calculation of maritime emissions',
  sources: 'Procedures related to emissions sources and emissions factorsAccepted',
  greenhouseGas: 'Procedures related to the monitoring of greenhouse gas emissions and fuel consumption',
  dataGaps: 'Data gaps',
  managementProcedures: 'Management procedures',
  controlActivities: 'Control activities',
  abbreviations: 'List of definitions and abbreviations',
  additionalDocuments: 'Additional information',
  empVariationDetails: 'Review the changes',
};
