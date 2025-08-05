import {
  VirApplicationRespondToRegulatorCommentsRequestTaskPayload,
  VirApplicationReviewRequestTaskPayload,
  VirApplicationSubmitRequestTaskPayload,
} from '@mrtm/api';

export type VirCommonTaskPayload = Pick<
  | VirApplicationSubmitRequestTaskPayload
  | VirApplicationReviewRequestTaskPayload
  | VirApplicationRespondToRegulatorCommentsRequestTaskPayload,
  'payloadType' | 'virAttachments' | 'operatorImprovementResponses' | 'verificationData' | 'sectionsCompleted'
>;
