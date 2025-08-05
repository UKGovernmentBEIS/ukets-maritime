import { inject } from '@angular/core';

import { RequestTaskPageContentFactory } from '@netz/common/request-task';
import { requestActionQuery, RequestActionStore } from '@netz/common/store';

import { NotificationCompletedComponent } from '@requests/timeline/notification-completed/notification-completed.component';
import { taskActionTypeToTitleMap } from '@shared/constants';

export const notificationCompletedTaskContent: RequestTaskPageContentFactory = () => {
  const store = inject(RequestActionStore);
  const action = store.select(requestActionQuery.selectAction)();

  return {
    header: taskActionTypeToTitleMap?.[action?.type],
    component: NotificationCompletedComponent,
    sections: [],
  };
};
