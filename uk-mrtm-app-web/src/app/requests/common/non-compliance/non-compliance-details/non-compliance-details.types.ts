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
  | 'nonComplianceComments'
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
  | 'nonComplianceComments'
  | 'civilPenalty'
  | 'noCivilPenaltyJustification'
  | 'noticeOfIntent'
  | 'initialPenalty'
> & { selectedRequestsMapped: Pick<RequestInfoDTO, 'id' | 'type'>[] };
