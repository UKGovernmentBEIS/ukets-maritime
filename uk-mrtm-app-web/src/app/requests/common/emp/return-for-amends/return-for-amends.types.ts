import { Observable } from 'rxjs';

import { EmissionsMonitoringPlan, RequestTaskPayload } from '@mrtm/api';

import { EmpReviewDecisionDto, EmpVariationReviewDecisionDto } from '@shared/types';

export interface IReturnForAmendsService<T extends RequestTaskPayload> {
  sendForAmends(): Observable<T>;
}
export interface ReviewAmendDecisionDTO {
  subtask: keyof EmissionsMonitoringPlan | string;
  decision: EmpReviewDecisionDto | EmpVariationReviewDecisionDto;
}
