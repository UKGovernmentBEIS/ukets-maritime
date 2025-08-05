import { inject } from '@angular/core';

import { RequestTaskPageContentFactory } from '@netz/common/request-task';
import { requestActionQuery, RequestActionStore } from '@netz/common/store';

import { FollowUpResponseSubmittedComponent } from '@requests/timeline/follow-up-response-submitted/follow-up-response-submitted.component';
import { taskActionTypeToTitleMap } from '@shared/constants';

export const followUpResponseSubmittedTaskContent: RequestTaskPageContentFactory = () => {
  const store = inject(RequestActionStore);
  const action = store.select(requestActionQuery.selectAction)();

  return {
    header: taskActionTypeToTitleMap?.[action?.type],
    component: FollowUpResponseSubmittedComponent,
    sections: [],
  };
};
