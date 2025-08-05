import { inject } from '@angular/core';

import { RequestTaskPageContentFactory } from '@netz/common/request-task';
import { RequestActionStore } from '@netz/common/store';

import { statusTagMap } from '@requests/common/status-tag.map';
import { empVariationReviewedQuery } from '@requests/timeline/emp-variation-reviewed/+state';
import { EmpVariationReviewedComponent } from '@requests/timeline/emp-variation-reviewed/emp-variation-reviewed.component';

export const empVariationReviewedTaskContent: RequestTaskPageContentFactory = () => {
  const store = inject(RequestActionStore);
  const decision = store.select(empVariationReviewedQuery.selectDecision)();

  return {
    header: statusTagMap[decision]?.text,
    component: EmpVariationReviewedComponent,
    sections: [],
  };
};
