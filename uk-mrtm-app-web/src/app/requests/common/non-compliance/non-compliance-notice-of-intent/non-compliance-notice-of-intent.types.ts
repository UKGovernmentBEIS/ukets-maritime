import {
  NonComplianceNoticeOfIntentApplicationSubmittedRequestActionPayload,
  NonComplianceNoticeOfIntentRequestTaskPayload,
} from '@mrtm/api';

export type NonComplianceNoticeOfIntentUpload = Pick<
  NonComplianceNoticeOfIntentRequestTaskPayload,
  'noticeOfIntent' | 'comments' | 'nonComplianceAttachments'
>;

export type NonComplianceNoticeOfIntentTimelinePayload =
  NonComplianceNoticeOfIntentApplicationSubmittedRequestActionPayload;
