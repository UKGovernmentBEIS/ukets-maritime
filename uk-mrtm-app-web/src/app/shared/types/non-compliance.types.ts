import { NonComplianceApplicationSubmitRequestTaskPayload } from '@mrtm/api';

import { MrtmRequestStatus, MrtmRequestType } from '@shared/types';

export type NonComplianceReason = NonComplianceApplicationSubmitRequestTaskPayload['reason'];

export const NON_COMPLIANCE_REASON_TYPES: NonComplianceReason[] = [
  'FAILURE_TO_APPLY_FOR_AN_EMISSIONS_MONITORING_PLAN',
  'FAILURE_TO_COMPLY_WITH_A_CONDITION_OF_AN_EMISSIONS_MONITORING_PLAN',
  'FAILURE_TO_MONITOR_EMISSIONS',
  'FAILURE_TO_REPORT_EMISSIONS',
  'FAILURE_TO_COMPLY_WITH_DEFICIT_NOTICE',
  'FAILURE_TO_COMPLY_WITH_AN_ENFORCEMENT_NOTICE',
  'FAILURE_TO_COMPLY_WITH_AN_INFORMATION_NOTICE',
  'PROVIDING_FALSE_OR_MISLEADING_INFORMATION',
  'REFUSAL_TO_ALLOW_ACCESS_TO_PREMISES',
  'FAILURE_TO_SURRENDER_ALLOWANCE_100',
  'FAILURE_TO_SURRENDER_ALLOWANCE_20',
] as const;

export const nonComplianceTypesMap: Record<MrtmRequestType, string> = {
  // Values must be in alphabetical order
  NON_COMPLIANCE: 'Non-compliance',
};

export const nonComplianceStatusMap: Record<MrtmRequestStatus, string> = {
  // Values must be in alphabetical order
  CLOSED: 'Closed',
  COMPLETED: 'Completed',
  IN_PROGRESS: 'In progress',
};
