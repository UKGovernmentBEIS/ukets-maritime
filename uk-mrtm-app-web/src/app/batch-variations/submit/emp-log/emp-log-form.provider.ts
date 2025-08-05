import { Provider } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { EmpBatchReissueRequestCreateActionPayload } from '@mrtm/api';

import { GovukValidators } from '@netz/govuk-components';

import { batchVariationsQuery, BatchVariationStore } from '@batch-variations/+state';
import { BATCH_VARIATION_FORM } from '@batch-variations/batch-variations.types';
import { EmpLogFormModel } from '@batch-variations/submit/emp-log/emp-log.types';

export const empLogFormProvider: Provider = {
  provide: BATCH_VARIATION_FORM,
  deps: [FormBuilder, BatchVariationStore],
  useFactory: (formBuilder: FormBuilder, store: BatchVariationStore): EmpLogFormModel => {
    const currentItem = store.select(batchVariationsQuery.selectCurrentItem)();
    return formBuilder.group({
      summary: formBuilder.control<EmpBatchReissueRequestCreateActionPayload['summary'] | null>(currentItem?.summary, {
        validators: [
          GovukValidators.required('Enter a summary'),
          GovukValidators.maxLength(10000, 'Enter up to 10000 characters'),
        ],
      }),
    });
  },
};
