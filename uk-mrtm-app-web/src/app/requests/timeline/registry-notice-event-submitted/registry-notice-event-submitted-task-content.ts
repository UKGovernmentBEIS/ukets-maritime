import { inject } from '@angular/core';

import { RequestTaskPageContentFactory } from '@netz/common/request-task';
import { requestActionQuery, RequestActionStore } from '@netz/common/store';

import { RegistryNoticeEventSubmittedComponent } from '@requests/timeline/registry-notice-event-submitted/registry-notice-event-submitted.component';
import { taskActionTypeToTitleMap } from '@shared/constants';

export const registryNoticeEventSubmittedTaskContent: RequestTaskPageContentFactory = () => {
  const store = inject(RequestActionStore);
  const action = store.select(requestActionQuery.selectAction)();

  return {
    header: taskActionTypeToTitleMap?.[action?.type],
    component: RegistryNoticeEventSubmittedComponent,
  };
};
