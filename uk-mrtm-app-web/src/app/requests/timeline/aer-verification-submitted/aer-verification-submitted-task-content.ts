import { inject } from '@angular/core';

import { RequestTaskPageContentFactory } from '@netz/common/request-task';
import { requestActionQuery, RequestActionStore } from '@netz/common/store';

import { timelineCommonQuery } from '@requests/common/timeline';
import { AerVerificationSubmittedComponent } from '@requests/timeline/aer-verification-submitted/components';
import { taskActionTypeToTitleTransformer } from '@shared/utils/transformers';

export const aerVerificationSubmittedTaskContent: RequestTaskPageContentFactory = () => {
  const store = inject(RequestActionStore);
  const actionType = store.select(requestActionQuery.selectActionType)();
  const year = store.select(timelineCommonQuery.selectReportingYear)();

  return {
    header: taskActionTypeToTitleTransformer(actionType, year),
    headerSize: 'xl',
    component: AerVerificationSubmittedComponent,
  };
};
