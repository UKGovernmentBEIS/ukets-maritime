import { inject } from '@angular/core';

import { RequestTaskPageContentFactory } from '@netz/common/request-task';
import { requestActionQuery, RequestActionStore } from '@netz/common/store';

import { RfiSubmittedComponent } from '@requests/timeline/rfi-submitted/rfi-submitted.component';
import { taskActionTypeToTitleMap } from '@shared/constants';

export const rfiSubmittedTaskContent: RequestTaskPageContentFactory = () => {
  const store = inject(RequestActionStore);
  const action = store.select(requestActionQuery.selectAction)();

  return {
    header: taskActionTypeToTitleMap?.[action?.type],
    component: RfiSubmittedComponent,
    sections: [],
  };
};
