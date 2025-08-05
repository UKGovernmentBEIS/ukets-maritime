import {
  UncorrectedItem,
  VerifierComment,
  VirApplicationReviewRequestTaskPayload,
  VirVerificationData,
} from '@mrtm/api';

export type VirReviewTaskPayload = VirApplicationReviewRequestTaskPayload;

export type VirVerifierRecommendationDataItem = (UncorrectedItem | VerifierComment) & {
  verificationDataKey: keyof VirVerificationData;
};

export type VirVerifierRecommendationData = Record<string, VirVerifierRecommendationDataItem>;
