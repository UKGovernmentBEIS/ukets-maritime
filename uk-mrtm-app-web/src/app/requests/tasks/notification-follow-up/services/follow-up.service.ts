import { Injectable } from '@angular/core';

import { TaskService } from '@netz/common/forms';

import { followUpQuery } from '@requests/tasks/notification-follow-up/+state';
import { FollowUpTaskPayload } from '@requests/tasks/notification-follow-up/follow-up.types';

@Injectable()
export class FollowUpService extends TaskService<FollowUpTaskPayload> {
  get payload(): FollowUpTaskPayload {
    return this.store.select(followUpQuery.selectPayload)();
  }

  set payload(payload: FollowUpTaskPayload) {
    this.store.setPayload(payload);
  }
}
