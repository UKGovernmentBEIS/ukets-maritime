import { inject } from '@angular/core';

import { RequestTaskPageContentFactory } from '@netz/common/request-task';
import { requestActionQuery, RequestActionStore } from '@netz/common/store';

import { RegistryAccountUpdatedComponent } from '@requests/timeline/registry-account-updated/registry-account-updated.component';
import { taskActionTypeToTitleMap } from '@shared/constants';

export const registryAccountUpdatedTaskContent: RequestTaskPageContentFactory = () => {
  const store = inject(RequestActionStore);
  const action = store.select(requestActionQuery.selectAction)();

  return {
    header: taskActionTypeToTitleMap?.[action?.type],
    component: RegistryAccountUpdatedComponent,
  };
};
