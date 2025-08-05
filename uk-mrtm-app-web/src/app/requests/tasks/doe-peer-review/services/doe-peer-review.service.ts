import { doeCommonQuery } from '@requests/common/doe';
import { BasePeerReviewService } from '@requests/common/services';
import { DoePeerReviewRequestTaskPayload } from '@requests/tasks/doe-peer-review/doe-peer-review.types';

export class DoePeerReviewService extends BasePeerReviewService<DoePeerReviewRequestTaskPayload> {
  get payload(): DoePeerReviewRequestTaskPayload {
    return this.store.select(doeCommonQuery.selectPayload)() as DoePeerReviewRequestTaskPayload;
  }

  set payload(payload: DoePeerReviewRequestTaskPayload) {
    this.store.setPayload(payload);
  }
}
