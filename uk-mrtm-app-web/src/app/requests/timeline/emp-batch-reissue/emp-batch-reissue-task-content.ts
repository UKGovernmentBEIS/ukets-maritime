import { inject } from '@angular/core';

import { RequestTaskPageContentFactory } from '@netz/common/request-task';
import { requestActionQuery, RequestActionStore } from '@netz/common/store';

import { EmpBatchReissueComponent } from '@requests/timeline/emp-batch-reissue/emp-batch-reissue.component';
import { taskActionTypeToTitleMap } from '@shared/constants';

export const empBatchReissueTaskContent: RequestTaskPageContentFactory = () => {
  const store = inject(RequestActionStore);
  const actionType = store.select(requestActionQuery.selectActionType)();

  return {
    header: taskActionTypeToTitleMap[actionType],
    component: EmpBatchReissueComponent,
  };
};
