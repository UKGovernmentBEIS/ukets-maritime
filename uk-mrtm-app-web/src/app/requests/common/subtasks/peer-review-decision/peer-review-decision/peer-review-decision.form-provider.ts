import { UntypedFormBuilder } from '@angular/forms';

import { PeerReviewDecision } from '@mrtm/api';

import { RequestTaskState, RequestTaskStore, StateSelector } from '@netz/common/store';
import { GovukValidators } from '@netz/govuk-components';

import { PEER_REVIEW_DECISION_SELECTOR } from '@requests/common/subtasks/peer-review-decision/peer-review-decision.providers';
import { TASK_FORM } from '@requests/common/task-form.token';

export const peerReviewDecisionFormProvider = {
  provide: TASK_FORM,
  deps: [UntypedFormBuilder, RequestTaskStore, PEER_REVIEW_DECISION_SELECTOR],
  useFactory: (
    fb: UntypedFormBuilder,
    store: RequestTaskStore,
    decisionSelector: StateSelector<RequestTaskState, PeerReviewDecision>,
  ) => {
    const decision = store.select(decisionSelector)();

    return fb.group(
      {
        type: fb.control(decision?.type ?? null, [GovukValidators.required('Select an option')]),
        notes: fb.control(decision?.notes ?? null, [
          GovukValidators.required('Enter notes to support your decision'),
          GovukValidators.maxLength(10000, 'Notes must be 10000 characters or less'),
        ]),
      },
      { updateOn: 'change' },
    );
  },
};
