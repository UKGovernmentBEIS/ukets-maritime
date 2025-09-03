import {
  NonComplianceCivilPenaltyApplicationSubmittedRequestActionPayload,
  NonComplianceCivilPenaltyRequestTaskPayload,
} from '@mrtm/api';

export type NonComplianceCivilPenaltyUpload = Pick<
  NonComplianceCivilPenaltyRequestTaskPayload,
  'civilPenalty' | 'penaltyAmount' | 'dueDate' | 'comments' | 'nonComplianceAttachments'
>;

export type NonComplianceCivilPenaltyTimelinePayload =
  NonComplianceCivilPenaltyApplicationSubmittedRequestActionPayload;
