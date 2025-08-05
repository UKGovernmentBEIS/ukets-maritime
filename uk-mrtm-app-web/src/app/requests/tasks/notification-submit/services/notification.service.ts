import { Injectable } from '@angular/core';

import { TaskService } from '@netz/common/forms';

import { notificationQuery } from '@requests/tasks/notification-submit/+state';
import { NotificationTaskPayload } from '@requests/tasks/notification-submit/notification.types';

@Injectable()
export class NotificationService extends TaskService<NotificationTaskPayload> {
  get payload(): NotificationTaskPayload {
    return this.store.select(notificationQuery.selectPayload)();
  }

  set payload(payload: NotificationTaskPayload) {
    this.store.setPayload(payload);
  }
}
