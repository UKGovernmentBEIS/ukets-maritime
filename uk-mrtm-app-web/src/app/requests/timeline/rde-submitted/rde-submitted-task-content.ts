import { inject } from '@angular/core';

import { RequestTaskPageContentFactory } from '@netz/common/request-task';
import { requestActionQuery, RequestActionStore } from '@netz/common/store';

import { RdeSubmittedComponent } from '@requests/timeline/rde-submitted/rde-submitted.component';
import { taskActionTypeToTitleMap } from '@shared/constants';

export const rdeSubmittedTaskContent: RequestTaskPageContentFactory = () => {
  const store = inject(RequestActionStore);
  const action = store.select(requestActionQuery.selectAction)();

  return {
    header: taskActionTypeToTitleMap?.[action?.type],
    component: RdeSubmittedComponent,
    sections: [],
  };
};
