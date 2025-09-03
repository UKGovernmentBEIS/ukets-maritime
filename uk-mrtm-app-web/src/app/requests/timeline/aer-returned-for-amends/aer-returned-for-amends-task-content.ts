import { inject } from '@angular/core';

import { RequestTaskPageContentFactory } from '@netz/common/request-task';
import { requestActionQuery, RequestActionStore } from '@netz/common/store';

import { timelineCommonQuery } from '@requests/common/timeline';
import { AerReturnedForAmendsComponent } from '@requests/timeline/aer-returned-for-amends/aer-returned-for-amends.component';
import { taskActionTypeToTitleTransformer } from '@shared/utils';

export const aerReturnedForAmendsTaskContent: RequestTaskPageContentFactory = () => {
  const store = inject(RequestActionStore);
  const actionType = store.select(requestActionQuery.selectActionType)();
  const year = store.select(timelineCommonQuery.selectReportingYear)();

  return {
    header: taskActionTypeToTitleTransformer(actionType, year),
    component: AerReturnedForAmendsComponent,
    sections: [],
  };
};
