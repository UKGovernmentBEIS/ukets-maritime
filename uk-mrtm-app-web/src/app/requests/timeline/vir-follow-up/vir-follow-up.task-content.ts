import { inject } from '@angular/core';

import { RequestTaskPageContentFactory } from '@netz/common/request-task';
import { requestActionQuery, RequestActionStore } from '@netz/common/store';

import { virFollowUpQuery } from '@requests/timeline/vir-follow-up/+state';
import { VirFollowUpDetailsComponent } from '@requests/timeline/vir-follow-up/vir-follow-up-details';
import { taskActionTypeToTitleMap } from '@shared/constants';

export const virFollowUpTaskContent: RequestTaskPageContentFactory = () => {
  const store = inject(RequestActionStore);
  const actionType = store.select(requestActionQuery.selectActionType)();
  const reference = store.select(virFollowUpQuery.selectReference)();
  return {
    header: `${taskActionTypeToTitleMap?.[actionType]} to ${reference}`,
    component: VirFollowUpDetailsComponent,
  };
};
