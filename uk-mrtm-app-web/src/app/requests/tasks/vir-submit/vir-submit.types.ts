import {
  UncorrectedItem,
  VerifierComment,
  VirApplicationSubmitRequestTaskPayload,
  VirVerificationData,
} from '@mrtm/api';

export type VirSubmitTaskPayload = VirApplicationSubmitRequestTaskPayload;

export type VirVerifierRecommendationDataItem = (UncorrectedItem | VerifierComment) & {
  verificationDataKey: keyof VirVerificationData;
};

export type VirVerifierRecommendationData = Record<string, VirVerifierRecommendationDataItem>;
