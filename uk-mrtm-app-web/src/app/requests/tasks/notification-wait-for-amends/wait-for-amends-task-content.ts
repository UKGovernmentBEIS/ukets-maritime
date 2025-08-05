import { RequestTaskPageContentFactory } from '@netz/common/request-task';

import { NotificationWaitForAmendsComponent } from '@requests/tasks/notification-wait-for-amends/notification-wait-for-amends.component';
import { waitForAmendsMap } from '@requests/tasks/notification-wait-for-amends/subtask-list.map';

export const waitForAmendsTaskContent: RequestTaskPageContentFactory = () => {
  return {
    header: waitForAmendsMap.title,
    contentComponent: NotificationWaitForAmendsComponent,
    sections: [],
  };
};
