import { inject } from '@angular/core';

import { RequestTaskPageContentFactory } from '@netz/common/request-task';
import { requestActionQuery, RequestActionStore } from '@netz/common/store';

import { RdeRegulatorDecisionComponent } from '@requests/timeline/rde-regulator-decision/rde-regulator-decision.component';
import { taskActionTypeToTitleMap } from '@shared/constants';

export const rdeRegulatorDecisionTaskContent: RequestTaskPageContentFactory = () => {
  const store = inject(RequestActionStore);
  const action = store.select(requestActionQuery.selectAction)();

  return {
    header: taskActionTypeToTitleMap?.[action?.type],
    component: RdeRegulatorDecisionComponent,
    sections: [],
  };
};
