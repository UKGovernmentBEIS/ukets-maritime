import { inject } from '@angular/core';

import { RequestTaskPageContentFactory } from '@netz/common/request-task';
import { requestActionQuery, RequestActionStore } from '@netz/common/store';

import { RdeRejectedComponent } from '@requests/timeline/rde-rejected/rde-rejected.component';
import { taskActionTypeToTitleMap } from '@shared/constants';

export const rdeRejectedTaskContent: RequestTaskPageContentFactory = () => {
  const store = inject(RequestActionStore);
  const action = store.select(requestActionQuery.selectAction)();

  return {
    header: taskActionTypeToTitleMap?.[action?.type],
    component: RdeRejectedComponent,
    sections: [],
  };
};
