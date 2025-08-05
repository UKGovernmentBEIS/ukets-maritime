import { inject } from '@angular/core';

import { RequestTaskPageContentFactory } from '@netz/common/request-task';
import { RequestActionStore } from '@netz/common/store';

import { empReviewedQuery } from '@requests/timeline/emp-reviewed/+state';
import { EmpReviewedComponent } from '@requests/timeline/emp-reviewed/emp-reviewed.component';

export const empReviewedTaskContent: RequestTaskPageContentFactory = () => {
  const store = inject(RequestActionStore);
  const decision = store.select(empReviewedQuery.selectDecision)();

  return {
    header: decision === 'APPROVED' ? 'Approved' : 'Withdrawn',
    component: EmpReviewedComponent,
  };
};
