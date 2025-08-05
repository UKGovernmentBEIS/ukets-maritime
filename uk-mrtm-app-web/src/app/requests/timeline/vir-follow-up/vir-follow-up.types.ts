import {
  OperatorImprovementFollowUpResponse,
  OperatorImprovementResponse,
  RegulatorImprovementResponse,
  UncorrectedItem,
  VerifierComment,
  VirApplicationSubmittedRequestActionPayload,
} from '@mrtm/api';

export interface VirFollowUpActionPayload
  extends Pick<VirApplicationSubmittedRequestActionPayload, 'reportingYear' | 'payloadType' | 'virAttachments'> {
  verifierComment?: VerifierComment | UncorrectedItem;
  operatorImprovementResponse?: OperatorImprovementResponse;
  operatorImprovementFollowUpResponse: OperatorImprovementFollowUpResponse;
  regulatorImprovementResponse?: RegulatorImprovementResponse;
}
