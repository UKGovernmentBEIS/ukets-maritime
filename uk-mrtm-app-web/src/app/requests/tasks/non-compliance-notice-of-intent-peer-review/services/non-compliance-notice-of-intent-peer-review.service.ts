import { nonComplianceNoticeOfIntentCommonQuery } from '@requests/common/non-compliance/non-compliance-notice-of-intent/+state';
import { BasePeerReviewService } from '@requests/common/services';
import { NonComplianceNoticeOfIntentPeerReviewRequestTaskPayload } from '@requests/tasks/non-compliance-notice-of-intent-peer-review/non-compliance-notice-of-intent-peer-review.types';

export class NonComplianceNoticeOfIntentPeerReviewService extends BasePeerReviewService<NonComplianceNoticeOfIntentPeerReviewRequestTaskPayload> {
  get payload(): NonComplianceNoticeOfIntentPeerReviewRequestTaskPayload {
    return this.store.select(
      nonComplianceNoticeOfIntentCommonQuery.selectPayload,
    )() as NonComplianceNoticeOfIntentPeerReviewRequestTaskPayload;
  }

  set payload(payload: NonComplianceNoticeOfIntentPeerReviewRequestTaskPayload) {
    this.store.setPayload(payload);
  }
}
