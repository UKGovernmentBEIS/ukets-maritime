import { inject } from '@angular/core';

import { RequestTaskPageContentFactory } from '@netz/common/request-task';
import { requestActionQuery, RequestActionStore } from '@netz/common/store';

import { NonComplianceFinalDeterminationSubmittedComponent } from '@requests/timeline/non-compliance-final-determination-submitted/non-compliance-final-determination-submitted.component';
import { taskActionTypeToTitleTransformer } from '@shared/utils/transformers';

export const nonComplianceFinalDeterminationSubmittedTaskContent: RequestTaskPageContentFactory = () => {
  const store = inject(RequestActionStore);
  const actionType = store.select(requestActionQuery.selectActionType)();
  const submitter = store.select(requestActionQuery.selectSubmitter)();

  return {
    header: `${taskActionTypeToTitleTransformer(actionType)} by ${submitter}`,
    component: NonComplianceFinalDeterminationSubmittedComponent,
  };
};
