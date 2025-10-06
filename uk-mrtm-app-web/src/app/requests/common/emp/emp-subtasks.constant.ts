import { EmissionsMonitoringPlan } from '@mrtm/api';

export const EMP_SUBTASKS: Array<keyof EmissionsMonitoringPlan> = [
  'operatorDetails',
  'emissions',
  'sources',
  'greenhouseGas',
  'dataGaps',
  'mandate',
  'managementProcedures',
  'controlActivities',
  'abbreviations',
  'additionalDocuments',
];
