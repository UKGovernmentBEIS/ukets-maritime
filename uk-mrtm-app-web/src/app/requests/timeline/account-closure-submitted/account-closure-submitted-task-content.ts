import { inject } from '@angular/core';

import { RequestTaskPageContentFactory } from '@netz/common/request-task';
import { requestActionQuery, RequestActionStore } from '@netz/common/store';

import { AccountClosureSubmittedComponent } from '@requests/timeline/account-closure-submitted/account-closure-submitted.component';
import { taskActionTypeToTitleMap } from '@shared/constants';

export const accountClosureSubmittedTaskContent: RequestTaskPageContentFactory = () => {
  const store = inject(RequestActionStore);
  const actionType = store.select(requestActionQuery.selectActionType)();

  return {
    header: taskActionTypeToTitleMap[actionType],
    component: AccountClosureSubmittedComponent,
  };
};
