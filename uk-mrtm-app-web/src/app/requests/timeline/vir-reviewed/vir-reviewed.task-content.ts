import { inject } from '@angular/core';

import { RequestTaskPageContentFactory } from '@netz/common/request-task';
import { requestActionQuery, RequestActionStore } from '@netz/common/store';

import { VirReviewedDetailsComponent } from '@requests/timeline/vir-reviewed/vir-reviewed-details';
import { taskActionTypeToTitleMap } from '@shared/constants';

export const virReviewedTaskContent: RequestTaskPageContentFactory = () => {
  const store = inject(RequestActionStore);
  const actionType = store.select(requestActionQuery.selectActionType)();

  return {
    header: taskActionTypeToTitleMap?.[actionType],
    component: VirReviewedDetailsComponent,
  };
};
