import { inject } from '@angular/core';

import { RequestTaskStore } from '@netz/common/store';

import { TaskItemStatus } from '@requests/common';
import { aerCommonQuery } from '@requests/common/aer/+state';
import { AER_ROUTE_PREFIX } from '@requests/common/aer/aer.consts';
import { AER_PORTS_SUB_TASK } from '@requests/common/aer/subtasks/aer-ports';
import { getGuardedSections } from '@requests/common/aer/subtasks/aer-subtasks.helpers';
import { AER_VOYAGES_SUB_TASK } from '@requests/common/aer/subtasks/aer-voyages/aer-voyages.helpers';
import { REPORTING_OBLIGATION_SUB_TASK } from '@requests/common/aer/subtasks/reporting-obligation';
import { aerSubmitQuery } from '@requests/tasks/aer-submit/+state';

export function getCanSubmitAer(): boolean {
  const store = inject(RequestTaskStore);
  const shouldSubmitToRegulator = store.select(aerSubmitQuery.selectShouldSubmitToRegulator)();
  const reportingYear = +store.select(aerCommonQuery.selectReportingYear)();
  const currentYear = new Date().getFullYear();
  const sectionsCompleted = store.select(aerCommonQuery.selectAerSectionsCompleted)();
  const subtaskNames = getGuardedSections(AER_ROUTE_PREFIX)
    .map((section) => section.tasks)
    .reduce((acc, tasks) => [...acc, ...tasks], [])
    .map((task) => task.name);

  return (
    (shouldSubmitToRegulator ? reportingYear < currentYear : true) &&
    sectionsCompleted?.[REPORTING_OBLIGATION_SUB_TASK] === TaskItemStatus.COMPLETED &&
    subtaskNames.every((subtask) => {
      if (subtask === AER_PORTS_SUB_TASK || subtask === AER_VOYAGES_SUB_TASK) {
        return (
          sectionsCompleted?.[subtask] === TaskItemStatus.COMPLETED ||
          sectionsCompleted?.[subtask] === TaskItemStatus.OPTIONAL ||
          sectionsCompleted?.[subtask] === undefined
        );
      } else {
        return sectionsCompleted?.[subtask] === TaskItemStatus.COMPLETED;
      }
    })
  );
}
