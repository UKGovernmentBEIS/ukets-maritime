import { inject } from '@angular/core';

import { RequestTaskPageContentFactory } from '@netz/common/request-task';
import { requestActionQuery, RequestActionStore } from '@netz/common/store';

import { EmpReturnedForAmendsComponent } from '@requests/timeline/emp-returned-for-amends/emp-returned-for-amends.component';
import { taskActionTypeToTitleMap } from '@shared/constants';

export const empReturnedForAmendsTaskContent: RequestTaskPageContentFactory = () => {
  const store = inject(RequestActionStore);
  const actionType = store.select(requestActionQuery.selectActionType)();

  return {
    header: taskActionTypeToTitleMap[actionType],
    component: EmpReturnedForAmendsComponent,
  };
};
