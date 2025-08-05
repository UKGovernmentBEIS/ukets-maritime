import { empCommonQuery, EmpVariationPeerReviewTaskPayload } from '@requests/common';
import { BasePeerReviewService } from '@requests/common/services';

export class EmpVariationPeerReviewService extends BasePeerReviewService<EmpVariationPeerReviewTaskPayload> {
  get payload(): EmpVariationPeerReviewTaskPayload {
    return this.store.select(empCommonQuery.selectPayload<EmpVariationPeerReviewTaskPayload>())();
  }

  set payload(payload: EmpVariationPeerReviewTaskPayload) {
    this.store.setPayload(payload);
  }
}
