import { inject } from '@angular/core';

import { RequestTaskPageContentFactory } from '@netz/common/request-task';
import { requestActionQuery, RequestActionStore } from '@netz/common/store';

import { FollowUpReturnedForAmendsComponent } from '@requests/timeline/follow-up-returned-for-amends/follow-up-returned-for-amends.component';
import { taskActionTypeToTitleMap } from '@shared/constants';

export const followUpReturnedForAmendsTaskContent: RequestTaskPageContentFactory = () => {
  const store = inject(RequestActionStore);
  const action = store.select(requestActionQuery.selectAction)();

  return {
    header: taskActionTypeToTitleMap?.[action?.type],
    component: FollowUpReturnedForAmendsComponent,
    sections: [],
  };
};
