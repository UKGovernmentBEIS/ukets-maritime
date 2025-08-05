import { inject } from '@angular/core';

import { RequestTaskPageContentFactory } from '@netz/common/request-task';
import { requestActionQuery, RequestActionStore } from '@netz/common/store';

import { AerVerificationReturnedToOperatorComponent } from '@requests/timeline/aer-verification-returned-to-operator/aer-verification-returned-to-operator.component';
import { taskActionTypeToTitleMap } from '@shared/constants';

export const aerVerificationReturnedToOperatorTaskContent: RequestTaskPageContentFactory = () => {
  const store = inject(RequestActionStore);
  const actionType = store.select(requestActionQuery.selectActionType)();
  const submitter = store.select(requestActionQuery.selectSubmitter)();

  return {
    header: `${taskActionTypeToTitleMap[actionType]} by ${submitter}`,
    component: AerVerificationReturnedToOperatorComponent,
  };
};
