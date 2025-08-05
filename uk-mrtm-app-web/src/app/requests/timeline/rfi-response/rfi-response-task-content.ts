import { inject } from '@angular/core';

import { RequestTaskPageContentFactory } from '@netz/common/request-task';
import { requestActionQuery, RequestActionStore } from '@netz/common/store';

import { RfiResponseComponent } from '@requests/timeline/rfi-response/rfi-response.component';
import { taskActionTypeToTitleMap } from '@shared/constants';

export const rfiResponseTaskContent: RequestTaskPageContentFactory = () => {
  const store = inject(RequestActionStore);
  const action = store.select(requestActionQuery.selectAction)();

  return {
    header: taskActionTypeToTitleMap?.[action?.type],
    component: RfiResponseComponent,
    sections: [],
  };
};
