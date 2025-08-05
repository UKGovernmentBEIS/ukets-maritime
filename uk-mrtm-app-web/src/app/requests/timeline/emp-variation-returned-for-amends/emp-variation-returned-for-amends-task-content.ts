import { inject } from '@angular/core';

import { RequestTaskPageContentFactory } from '@netz/common/request-task';
import { requestActionQuery, RequestActionStore } from '@netz/common/store';

import { EmpVariationReturnedForAmendsComponent } from '@requests/timeline/emp-variation-returned-for-amends/emp-variation-returned-for-amends.component';
import { taskActionTypeToTitleMap } from '@shared/constants';

export const empVariationReturnedForAmendsTaskContent: RequestTaskPageContentFactory = () => {
  const store = inject(RequestActionStore);
  const actionType = store.select(requestActionQuery.selectActionType)();

  return {
    header: taskActionTypeToTitleMap[actionType],
    component: EmpVariationReturnedForAmendsComponent,
    sections: [],
  };
};
