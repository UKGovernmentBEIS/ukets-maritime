import { inject } from '@angular/core';

import { RequestTaskPageContentFactory } from '@netz/common/request-task';
import { requestActionQuery, RequestActionStore } from '@netz/common/store';

import { NotificationSubmittedComponent } from '@requests/timeline/notification-submitted/notification-submitted.component';
import { taskActionTypeToTitleMap } from '@shared/constants';

export const notificationSubmittedTaskContent: RequestTaskPageContentFactory = () => {
  const store = inject(RequestActionStore);
  const action = store.select(requestActionQuery.selectAction)();

  return {
    header: taskActionTypeToTitleMap?.[action?.type],
    component: NotificationSubmittedComponent,
    sections: [],
  };
};
