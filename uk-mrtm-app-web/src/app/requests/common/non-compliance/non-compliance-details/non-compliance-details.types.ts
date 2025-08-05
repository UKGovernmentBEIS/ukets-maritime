import {
  NonComplianceApplicationSubmitRequestTaskPayload,
  NonComplianceApplicationSubmittedRequestActionPayload,
  RequestInfoDTO,
} from '@mrtm/api';

export type NonComplianceSubmitTaskPayload = NonComplianceApplicationSubmitRequestTaskPayload;
export type NonComplianceSubmittedTimelinePayload = NonComplianceApplicationSubmittedRequestActionPayload;

export type NonComplianceDetails = Pick<
  NonComplianceSubmitTaskPayload,
  | 'reason'
  | 'nonComplianceDate'
  | 'complianceDate'
  | 'comments'
  | 'availableRequests'
  | 'selectedRequests'
  | 'civilPenalty'
  | 'noCivilPenaltyJustification'
  | 'noticeOfIntent'
  | 'initialPenalty'
>;

export type NonComplianceDetailsSummary = Pick<
  NonComplianceSubmitTaskPayload | NonComplianceSubmittedTimelinePayload,
  | 'reason'
  | 'nonComplianceDate'
  | 'complianceDate'
  | 'comments'
  | 'civilPenalty'
  | 'noCivilPenaltyJustification'
  | 'noticeOfIntent'
  | 'initialPenalty'
> & { selectedRequestsMapped: Pick<RequestInfoDTO, 'id' | 'type'>[] };
