import {
  EmpVariationApplicationApprovedRequestActionPayload,
  EmpVariationApplicationDeemedWithdrawnRequestActionPayload,
  EmpVariationApplicationRejectedRequestActionPayload,
} from '@mrtm/api';

export type EmpVariationReviewedTaskPayload =
  | EmpVariationApplicationApprovedRequestActionPayload
  | EmpVariationApplicationRejectedRequestActionPayload
  | EmpVariationApplicationDeemedWithdrawnRequestActionPayload;
