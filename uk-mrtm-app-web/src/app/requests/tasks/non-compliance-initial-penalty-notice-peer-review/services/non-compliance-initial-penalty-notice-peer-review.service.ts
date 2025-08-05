import { nonComplianceInitialPenaltyNoticeCommonQuery } from '@requests/common/non-compliance/non-compliance-initial-penalty-notice/+state';
import { BasePeerReviewService } from '@requests/common/services';
import { NonComplianceInitialPenaltyNoticePeerReviewRequestTaskPayload } from '@requests/tasks/non-compliance-initial-penalty-notice-peer-review/non-compliance-initial-penalty-notice-peer-review.types';

export class NonComplianceInitialPenaltyNoticePeerReviewService extends BasePeerReviewService<NonComplianceInitialPenaltyNoticePeerReviewRequestTaskPayload> {
  get payload(): NonComplianceInitialPenaltyNoticePeerReviewRequestTaskPayload {
    return this.store.select(
      nonComplianceInitialPenaltyNoticeCommonQuery.selectPayload,
    )() as NonComplianceInitialPenaltyNoticePeerReviewRequestTaskPayload;
  }

  set payload(payload: NonComplianceInitialPenaltyNoticePeerReviewRequestTaskPayload) {
    this.store.setPayload(payload);
  }
}
