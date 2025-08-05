import { inject } from '@angular/core';

import { RequestTaskPageContentFactory } from '@netz/common/request-task';
import { requestActionQuery, RequestActionStore } from '@netz/common/store';

import { NonComplianceNoticeOfIntentSubmittedComponent } from '@requests/timeline/non-compliance-notice-of-intent-submitted/non-compliance-notice-of-intent-submitted.component';
import { taskActionTypeToTitleTransformer } from '@shared/utils/transformers';

export const nonComplianceNoticeOfIntentSubmittedTaskContent: RequestTaskPageContentFactory = () => {
  const store = inject(RequestActionStore);
  const actionType = store.select(requestActionQuery.selectActionType)();
  const submitter = store.select(requestActionQuery.selectSubmitter)();

  return {
    header: `${taskActionTypeToTitleTransformer(actionType)} by ${submitter}`,
    component: NonComplianceNoticeOfIntentSubmittedComponent,
  };
};
