import { UntypedFormBuilder } from '@angular/forms';

import { GovukValidators } from '@netz/govuk-components';

import { TASK_FORM } from '@requests/common/task-form.token';
import { PeerReviewStore } from '@requests/tasks/notification-peer-review/+state/peer-review.store';
import { peerReviewDecisionQuery } from '@requests/tasks/notification-peer-review/+state/peer-review-decision.selectors';

export const peerReviewDecisionFormProvider = {
  provide: TASK_FORM,
  deps: [UntypedFormBuilder, PeerReviewStore],
  useFactory: (fb: UntypedFormBuilder, store: PeerReviewStore) => {
    const decision = store.select(peerReviewDecisionQuery.selectDecision)();

    return fb.group(
      {
        accepted: fb.control(decision?.accepted ?? null, [GovukValidators.required('Enter an assessment')]),
        notes: fb.control(decision?.notes ?? null, [
          GovukValidators.required('Enter notes'),
          GovukValidators.maxLength(10000, 'Enter up to 10000 characters'),
        ]),
      },
      { updateOn: 'change' },
    );
  },
};
