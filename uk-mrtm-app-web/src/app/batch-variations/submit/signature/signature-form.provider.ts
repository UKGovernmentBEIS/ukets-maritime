import { Provider } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { EmpBatchReissueRequestCreateActionPayload } from '@mrtm/api';

import { GovukValidators } from '@netz/govuk-components';

import { batchVariationsQuery, BatchVariationStore } from '@batch-variations/+state';
import { BATCH_VARIATION_FORM } from '@batch-variations/batch-variations.types';
import { SignatureFormModel } from '@batch-variations/submit/signature/signature.types';

export const signatureFormProvider: Provider = {
  provide: BATCH_VARIATION_FORM,
  deps: [FormBuilder, BatchVariationStore],
  useFactory: (formBuilder: FormBuilder, store: BatchVariationStore): SignatureFormModel => {
    const currentItem = store.select(batchVariationsQuery.selectCurrentItem)();

    return formBuilder.group({
      signatory: formBuilder.control<EmpBatchReissueRequestCreateActionPayload['signatory'] | null>(
        currentItem?.signatory,
        {
          validators: GovukValidators.required('Select a name to appear on the official notice document.'),
        },
      ),
    });
  },
};
