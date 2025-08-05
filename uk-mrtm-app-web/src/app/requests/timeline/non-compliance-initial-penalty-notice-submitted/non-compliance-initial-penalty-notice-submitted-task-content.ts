import { inject } from '@angular/core';

import { RequestTaskPageContentFactory } from '@netz/common/request-task';
import { requestActionQuery, RequestActionStore } from '@netz/common/store';

import { NonComplianceInitialPenaltyNoticeSubmittedComponent } from '@requests/timeline/non-compliance-initial-penalty-notice-submitted/non-compliance-initial-penalty-notice-submitted.component';
import { taskActionTypeToTitleTransformer } from '@shared/utils/transformers';

export const nonComplianceInitialPenaltyNoticeSubmittedTaskContent: RequestTaskPageContentFactory = () => {
  const store = inject(RequestActionStore);
  const actionType = store.select(requestActionQuery.selectActionType)();
  const submitter = store.select(requestActionQuery.selectSubmitter)();

  return {
    header: `${taskActionTypeToTitleTransformer(actionType)} by ${submitter}`,
    component: NonComplianceInitialPenaltyNoticeSubmittedComponent,
  };
};
