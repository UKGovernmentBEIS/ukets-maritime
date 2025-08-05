import { Provider } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { EmpVariationRegulatorLedReason } from '@mrtm/api';

import { RequestTaskStore } from '@netz/common/store';
import { GovukValidators } from '@netz/govuk-components';

import { empVariationRegulatorQuery } from '@requests/common/emp/+state';
import { EmpVariationDetailsReasonNoticeFormModel } from '@requests/common/emp/subtasks/variation-details/variation-details-reason-notice/variation-details-reason-notice.types';
import { TASK_FORM } from '@requests/common/task-form.token';

export const variationDetailsReasonNoticeFormProvider: Provider = {
  provide: TASK_FORM,
  deps: [FormBuilder, RequestTaskStore],
  useFactory: (fb: FormBuilder, store: RequestTaskStore): FormGroup<EmpVariationDetailsReasonNoticeFormModel> => {
    const regulatorLedReason = store.select(empVariationRegulatorQuery.selectReasonRegulatorLed)();

    return fb.group<EmpVariationDetailsReasonNoticeFormModel>({
      type: fb.control<EmpVariationRegulatorLedReason['type'] | null>(regulatorLedReason?.type, {
        validators: [GovukValidators.required('Select a reason to include in the notice')],
      }),
      reasonOtherSummary: fb.control<EmpVariationRegulatorLedReason['reasonOtherSummary'] | null>(
        regulatorLedReason?.reasonOtherSummary,
        {
          validators: [
            GovukValidators.required('Enter a reason to include in the operator notice'),
            GovukValidators.maxLength(10000, 'Enter up to 10000 characters.'),
          ],
        },
      ),
    });
  },
};
