import { inject } from '@angular/core';

import { RequestTaskPageContentFactory } from '@netz/common/request-task';
import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';

import { doeCommonQuery, DoeSubtasks, maritimeEmissionsMap } from '@requests/common/doe';
import { DoeSubmitActionButtonsComponent } from '@requests/tasks/doe-submit/components';
import { MARITIME_EMISSIONS_SUB_TASK } from '@requests/tasks/doe-submit/subtasks/maritime-emissions';
import { taskActionTypeToTitleTransformer } from '@shared/utils';

const routePrefix = 'doe-submit';

export const doeSubmitTaskContent: RequestTaskPageContentFactory = () => {
  const store = inject(RequestTaskStore);
  const requestTaskType = store.select(requestTaskQuery.selectRequestTaskType)();
  const year = store.select(doeCommonQuery.selectReportingYear)();

  return {
    header: taskActionTypeToTitleTransformer(requestTaskType, year),
    preContentComponent: DoeSubmitActionButtonsComponent,
    sections: [
      {
        title: maritimeEmissionsMap.title,
        tasks: [
          {
            name: MARITIME_EMISSIONS_SUB_TASK,
            status: store.select(doeCommonQuery.selectStatusForSubtask(MARITIME_EMISSIONS_SUB_TASK))(),
            linkText: maritimeEmissionsMap.title,
            link: `${routePrefix}/${DoeSubtasks.MaritimeEmissions}`,
          },
        ],
      },
    ],
  };
};
