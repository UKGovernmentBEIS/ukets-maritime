import { Injectable } from '@angular/core';

import { TaskService } from '@netz/common/forms';

import { followUpAmendQuery } from '@requests/tasks/notification-follow-up-amend/+state';
import { FollowUpAmendTaskPayload } from '@requests/tasks/notification-follow-up-amend/follow-up-amend.types';

@Injectable()
export class FollowUpAmendService extends TaskService<FollowUpAmendTaskPayload> {
  get payload(): FollowUpAmendTaskPayload {
    return this.store.select(followUpAmendQuery.selectPayload)();
  }

  set payload(payload: FollowUpAmendTaskPayload) {
    this.store.setPayload(payload);
  }
}
