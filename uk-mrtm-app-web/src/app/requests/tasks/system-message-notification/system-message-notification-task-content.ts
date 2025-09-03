import { inject } from '@angular/core';

import { RequestTaskPageContentFactory } from '@netz/common/request-task';
import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';

import {
  SystemMessageNotificationComponent,
  SystemMessageNotificationDateComponent,
} from '@requests/tasks/system-message-notification/components';
import { SystemMessageNotificationRequestTaskPayload } from '@requests/tasks/system-message-notification/system-message-notification.types';
import { taskActionTypeToTitleTransformer } from '@shared/utils';

export const systemMessageNotificationTaskContent: RequestTaskPageContentFactory = () => {
  const store = inject(RequestTaskStore);
  const payload = store.select(
    requestTaskQuery.selectRequestTaskPayload,
  )() as SystemMessageNotificationRequestTaskPayload;
  const requestTaskType = store.select(requestTaskQuery.selectRequestTaskType)();

  return {
    header: payload?.subject ?? taskActionTypeToTitleTransformer(requestTaskType),
    postHeaderComponent: SystemMessageNotificationDateComponent,
    contentComponent: SystemMessageNotificationComponent,
  };
};
