import { Observable } from 'rxjs';

import { EmissionsMonitoringPlan, RequestTaskPayload } from '@mrtm/api';

import { EmpVariationReviewDecisionDto, ReviewDecisionDto } from '@shared/types';

export interface IReturnForAmendsService<T extends RequestTaskPayload> {
  sendForAmends(): Observable<T>;
}
export interface ReviewAmendDecisionDTO {
  subtask: keyof EmissionsMonitoringPlan | string;
  decision: ReviewDecisionDto | EmpVariationReviewDecisionDto;
}
