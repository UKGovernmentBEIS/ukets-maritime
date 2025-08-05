import { Provider, Signal } from '@angular/core';

import { RequestTaskStore } from '@netz/common/store';

import { empVariationReviewQuery } from '@requests/common';
import { AMENDS_NEEDED_GROUPS, ReviewAmendDecisionDTO } from '@requests/common/emp/return-for-amends';

export const empVariationAmendsNeededGroupsProvider: Provider = {
  provide: AMENDS_NEEDED_GROUPS,
  deps: [RequestTaskStore],
  useFactory: (store: RequestTaskStore): Signal<Array<ReviewAmendDecisionDTO>> =>
    store.select(empVariationReviewQuery.selectEmpReviewDecisionForAmendsDTO),
};
