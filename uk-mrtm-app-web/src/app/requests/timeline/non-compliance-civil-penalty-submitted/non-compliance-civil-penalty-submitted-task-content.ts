import { inject } from '@angular/core';

import { RequestTaskPageContentFactory } from '@netz/common/request-task';
import { requestActionQuery, RequestActionStore } from '@netz/common/store';

import { NonComplianceCivilPenaltySubmittedComponent } from '@requests/timeline/non-compliance-civil-penalty-submitted/non-compliance-civil-penalty-submitted.component';
import { taskActionTypeToTitleTransformer } from '@shared/utils/transformers';

export const nonComplianceCivilPenaltySubmittedTaskContent: RequestTaskPageContentFactory = () => {
  const store = inject(RequestActionStore);
  const actionType = store.select(requestActionQuery.selectActionType)();
  const submitter = store.select(requestActionQuery.selectSubmitter)();

  return {
    header: `${taskActionTypeToTitleTransformer(actionType)} by ${submitter}`,
    component: NonComplianceCivilPenaltySubmittedComponent,
  };
};
