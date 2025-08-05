import { inject } from '@angular/core';

import { RequestTaskPageContentFactory } from '@netz/common/request-task';
import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';

import { WaitRegulatorDeterminationComponent } from '@shared/components/wait-regulator-determination/wait-regulator-determination.component';
import { taskActionTypeToTitleMap } from '@shared/constants';

export const waitForFollowUpReviewTaskContent: RequestTaskPageContentFactory = () => {
  const store = inject(RequestTaskStore);
  const requestTaskType = store.select(requestTaskQuery.selectRequestTaskType)();

  return {
    header: taskActionTypeToTitleMap?.[requestTaskType],
    preContentComponent: WaitRegulatorDeterminationComponent,
    sections: [],
  };
};
