import { FormControl, FormGroup, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';

import { EmpNotificationAcceptedDecisionDetails, EmpNotificationReviewDecisionDetails, FollowUp } from '@mrtm/api';

import { RequestTaskStore } from '@netz/common/store';
import { GovukValidators } from '@netz/govuk-components';

import { nocReviewQuery } from '@requests/common/emp/+state/noc-review.selectors';
import { TASK_FORM } from '@requests/common/task-form.token';
import { futureDateValidator } from '@shared/validators';

const getFollowUpFormGroup = (followUp?: FollowUp): UntypedFormGroup => {
  return new FormGroup({
    followUpResponseRequired: new FormControl(followUp?.followUpResponseRequired ?? null, [
      GovukValidators.required('Select yes or no'),
    ]),
    followUpRequest: new FormControl(followUp?.followUpRequest ?? null, [
      GovukValidators.required('Enter details'),
      GovukValidators.maxLength(10000, 'Enter up to 10000 characters'),
    ]),
    followUpResponseExpirationDate: new FormControl(
      followUp?.followUpResponseExpirationDate ? new Date(followUp?.followUpResponseExpirationDate) : null,
      [GovukValidators.required('Enter a date'), futureDateValidator()],
    ),
  });
};

export const detailsChangeDecisionFormProvider = {
  provide: TASK_FORM,
  deps: [UntypedFormBuilder, RequestTaskStore],
  useFactory: (fb: UntypedFormBuilder, store: RequestTaskStore) => {
    const reviewDecision = store.select(nocReviewQuery.selectReviewDecision)();
    const details = reviewDecision?.details as EmpNotificationAcceptedDecisionDetails &
      EmpNotificationReviewDecisionDetails;

    return fb.group({
      type: [
        reviewDecision?.type ?? null,
        { validators: [GovukValidators.required('Select a decision')], updateOn: 'change' },
      ],
      details: fb.group({
        followUp: getFollowUpFormGroup(details?.followUp),
        officialNotice: [
          details?.officialNotice ?? null,
          [
            GovukValidators.required('Enter a summary'),
            GovukValidators.maxLength(10000, 'Enter up to 10000 characters'),
          ],
        ],
        notes: [details?.notes ?? null, GovukValidators.maxLength(10000, 'Enter up to 10000 characters')],
      }),
    });
  },
};
