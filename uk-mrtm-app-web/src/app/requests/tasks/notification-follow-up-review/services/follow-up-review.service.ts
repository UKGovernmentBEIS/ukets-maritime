import { Injectable } from '@angular/core';

import { TaskService } from '@netz/common/forms';

import { followUpReviewQuery } from '@requests/tasks/notification-follow-up-review/+state';
import { FollowUpReviewTaskPayload } from '@requests/tasks/notification-follow-up-review/follow-up-review.types';

@Injectable()
export class FollowUpReviewService extends TaskService<FollowUpReviewTaskPayload> {
  get payload(): FollowUpReviewTaskPayload {
    return this.store.select(followUpReviewQuery.selectPayload)();
  }

  set payload(payload: FollowUpReviewTaskPayload) {
    this.store.setPayload(payload);
  }
}
