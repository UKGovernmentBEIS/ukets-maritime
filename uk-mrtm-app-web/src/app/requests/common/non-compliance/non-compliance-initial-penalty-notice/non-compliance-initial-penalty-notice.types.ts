import {
  NonComplianceInitialPenaltyNoticeApplicationSubmittedRequestActionPayload,
  NonComplianceInitialPenaltyNoticeRequestTaskPayload,
} from '@mrtm/api';

export type NonComplianceInitialPenaltyNoticeUpload = Pick<
  NonComplianceInitialPenaltyNoticeRequestTaskPayload,
  'initialPenaltyNotice' | 'comments' | 'nonComplianceAttachments'
>;

export type NonComplianceInitialPenaltyNoticeTimelinePayload =
  NonComplianceInitialPenaltyNoticeApplicationSubmittedRequestActionPayload;
