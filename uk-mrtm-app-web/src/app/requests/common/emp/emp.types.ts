import {
  EmpIssuanceApplicationAmendsSubmitRequestTaskPayload,
  EmpIssuanceApplicationReviewRequestTaskPayload,
  EmpIssuanceApplicationSubmitRequestTaskPayload,
  EmpNotificationApplicationReviewRequestTaskPayload,
  EmpVariationApplicationApprovedRequestActionPayload,
  EmpVariationApplicationReviewRequestTaskPayload,
  EmpVariationApplicationSubmitRegulatorLedRequestTaskPayload,
  EmpVariationApplicationSubmitRequestTaskPayload,
  EmpVariationSaveDetailsReviewGroupDecisionRequestTaskActionPayload,
  PeerReviewDecision,
} from '@mrtm/api';

export type EmpCommonTaskPayload = Pick<
  EmpIssuanceApplicationSubmitRequestTaskPayload | EmpIssuanceApplicationReviewRequestTaskPayload,
  'empAttachments' | 'empSectionsCompleted' | 'emissionsMonitoringPlan' | 'payloadType'
>;

export type EmpTaskPayload = EmpIssuanceApplicationSubmitRequestTaskPayload;

export type EmpVariationTaskPayload = EmpVariationApplicationSubmitRequestTaskPayload;

export type EmpReviewTaskPayload = EmpIssuanceApplicationReviewRequestTaskPayload;

export type EmpPeerReviewTaskPayload = EmpIssuanceApplicationReviewRequestTaskPayload & {
  decision: PeerReviewDecision;
};

export type EmpVariationReviewTaskPayload = EmpVariationApplicationReviewRequestTaskPayload;

export type EmpAmendTaskPayload = EmpIssuanceApplicationAmendsSubmitRequestTaskPayload;

export type EmpVariationRegulatorTaskPayload = EmpVariationApplicationSubmitRegulatorLedRequestTaskPayload;

export type EmpVariationPeerReviewTaskPayload = EmpVariationApplicationReviewRequestTaskPayload & {
  decision: PeerReviewDecision;
};

export type EmpVariationAmendTaskPayload = EmpVariationSaveDetailsReviewGroupDecisionRequestTaskActionPayload &
  EmpVariationApplicationApprovedRequestActionPayload;

export type EmpVariationRegulatorPeerReviewTaskPayload = EmpVariationApplicationSubmitRegulatorLedRequestTaskPayload & {
  decision: PeerReviewDecision;
};

export type ReviewTaskPayload = EmpNotificationApplicationReviewRequestTaskPayload;
