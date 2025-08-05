import { Injectable } from '@angular/core';

import { TaskService } from '@netz/common/forms';

import { nocReviewQuery } from '@requests/common/emp/+state/noc-review.selectors';
import { ReviewTaskPayload } from '@requests/common/emp/emp.types';

@Injectable()
export class ReviewService extends TaskService<ReviewTaskPayload> {
  get payload(): ReviewTaskPayload {
    return this.store.select(nocReviewQuery.selectPayload)();
  }

  set payload(payload: ReviewTaskPayload) {
    this.store.setPayload(payload);
  }
}
