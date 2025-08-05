import { inject } from '@angular/core';

import { RequestTaskStore } from '@netz/common/store';

import { TaskItemStatus } from '@requests/common';
import { aerCommonQuery } from '@requests/common/aer/+state';
import { AER_VERIFICATION_SUBMIT_ROUTE_PREFIX } from '@requests/common/aer/aer.consts';
import { getAerVerificationAssessmentsAndFindingsSections } from '@requests/common/aer/helpers';

export function getCanSubmitAerVerification(): boolean {
  const store = inject(RequestTaskStore);
  const sectionsCompleted = store.select(aerCommonQuery.selectVerificationSectionsCompleted)();
  const subtaskNames = getAerVerificationAssessmentsAndFindingsSections(
    AER_VERIFICATION_SUBMIT_ROUTE_PREFIX,
    sectionsCompleted,
  )
    .map((section) => section.tasks)
    .reduce((acc, tasks) => [...acc, ...tasks], [])
    .map((task) => task.name);

  return subtaskNames.every((subtask) => sectionsCompleted?.[subtask] === TaskItemStatus.COMPLETED);
}
