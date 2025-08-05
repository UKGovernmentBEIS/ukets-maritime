import { RequestTaskPageContentFactory } from '@netz/common/request-task';

import { NotificationWaitForFollowUpComponent } from '@requests/tasks/notification-wait-for-follow-up/notification-wait-for-follow-up.component';
import { waitForFollowUpMap } from '@requests/tasks/notification-wait-for-follow-up/subtask-list.map';

export const waitForFollowUpTaskContent: RequestTaskPageContentFactory = () => {
  return {
    header: waitForFollowUpMap.title,
    contentComponent: NotificationWaitForFollowUpComponent,
    sections: [],
  };
};
