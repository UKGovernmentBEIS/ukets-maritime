import { inject } from '@angular/core';

import { RequestTaskPageContentFactory } from '@netz/common/request-task';
import { requestActionQuery, RequestActionStore } from '@netz/common/store';

import { RegistrySubmittedComponent } from '@requests/timeline/registry-submitted/registry-submitted.component';
import { taskActionTypeToTitleMap } from '@shared/constants';

export const registrySubmittedTaskContent: RequestTaskPageContentFactory = () => {
  const store = inject(RequestActionStore);
  const action = store.select(requestActionQuery.selectAction)();

  return {
    header: taskActionTypeToTitleMap?.[action?.type],
    component: RegistrySubmittedComponent,
  };
};
