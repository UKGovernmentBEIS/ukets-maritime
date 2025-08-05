import { inject } from '@angular/core';

import { RequestTaskPageContentFactory } from '@netz/common/request-task';
import { requestActionQuery, RequestActionStore } from '@netz/common/store';

import { RegistryEmissionsUpdatedComponent } from '@requests/timeline/registry-emissions-updated/registry-emissions-updated.component';
import { taskActionTypeToTitleMap } from '@shared/constants';

export const registryEmissionsUpdatedTaskContent: RequestTaskPageContentFactory = () => {
  const store = inject(RequestActionStore);
  const action = store.select(requestActionQuery.selectAction)();

  return {
    header: taskActionTypeToTitleMap?.[action?.type],
    component: RegistryEmissionsUpdatedComponent,
  };
};
