import {
  NonComplianceApplicationSubmitRequestTaskPayload,
  NonComplianceCivilPenaltyRequestTaskPayload,
  NonComplianceFinalDeterminationRequestTaskPayload,
  NonComplianceInitialPenaltyNoticeRequestTaskPayload,
  NonComplianceNoticeOfIntentRequestTaskPayload,
} from '@mrtm/api';

export type NonComplianceUnionPayload =
  | NonComplianceApplicationSubmitRequestTaskPayload
  | NonComplianceNoticeOfIntentRequestTaskPayload
  | NonComplianceInitialPenaltyNoticeRequestTaskPayload
  | NonComplianceCivilPenaltyRequestTaskPayload
  | NonComplianceFinalDeterminationRequestTaskPayload;

export type NonComplianceDetailsBase = Pick<
  NonComplianceUnionPayload,
  'reason' | 'nonComplianceDate' | 'complianceDate' | 'nonComplianceComments'
>;
