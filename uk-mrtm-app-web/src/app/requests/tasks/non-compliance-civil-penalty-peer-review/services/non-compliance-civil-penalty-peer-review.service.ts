import { nonComplianceCivilPenaltyCommonQuery } from '@requests/common/non-compliance/non-compliance-civil-penalty/+state';
import { BasePeerReviewService } from '@requests/common/services';
import { NonComplianceCivilPenaltyPeerReviewRequestTaskPayload } from '@requests/tasks/non-compliance-civil-penalty-peer-review/non-compliance-civil-penalty-peer-review.types';

export class NonComplianceCivilPenaltyPeerReviewService extends BasePeerReviewService<NonComplianceCivilPenaltyPeerReviewRequestTaskPayload> {
  get payload(): NonComplianceCivilPenaltyPeerReviewRequestTaskPayload {
    return this.store.select(
      nonComplianceCivilPenaltyCommonQuery.selectPayload,
    )() as NonComplianceCivilPenaltyPeerReviewRequestTaskPayload;
  }

  set payload(payload: NonComplianceCivilPenaltyPeerReviewRequestTaskPayload) {
    this.store.setPayload(payload);
  }
}
