import { inject } from '@angular/core';

import { RequestTaskPageContentFactory } from '@netz/common/request-task';
import { requestActionQuery, RequestActionStore } from '@netz/common/store';

import { NotificationDecisionComponent } from '@requests/timeline/notification-decision/notification-decision.component';
import { taskActionTypeToTitleMap } from '@shared/constants';

export const notificationDecisionTaskContent: RequestTaskPageContentFactory = () => {
  const store = inject(RequestActionStore);
  const action = store.select(requestActionQuery.selectAction)();

  return {
    header: taskActionTypeToTitleMap?.[action?.type],
    component: NotificationDecisionComponent,
    sections: [],
  };
};
