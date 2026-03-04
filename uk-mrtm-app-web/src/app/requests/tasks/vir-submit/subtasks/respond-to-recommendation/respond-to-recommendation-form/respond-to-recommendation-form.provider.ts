import { Provider } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { RequestTaskStore } from '@netz/common/store';
import { GovukValidators } from '@netz/govuk-components';

import { TASK_FORM } from '@requests/common';
import { virCommonQuery } from '@requests/common/vir/+state';
import {
  RespondToRecommendationFormGroup,
  RespondToRecommendationFormModel,
} from '@requests/tasks/vir-submit/subtasks/respond-to-recommendation/respond-to-recommendation-form/respond-to-recommendation-form.types';
import { isNil } from '@shared/utils';
import { addressedDescriptionValidator } from '@shared/validators/recommendation.validator';

export const respondToRecommendationFormProvider: Provider = {
  provide: TASK_FORM,
  deps: [FormBuilder, RequestTaskStore, ActivatedRoute],
  useFactory: (
    formBuilder: FormBuilder,
    store: RequestTaskStore,
    activatedRoute: ActivatedRoute,
  ): FormGroup<RespondToRecommendationFormGroup> => {
    const key = activatedRoute.snapshot.params?.['key'];
    const operatorResponse = store.select(virCommonQuery.selectOperatorResponseData(key))();

    return formBuilder.group({
      key: formBuilder.control<RespondToRecommendationFormModel['key'] | null>(key),
      isAddressed: formBuilder.control<RespondToRecommendationFormModel['isAddressed'] | null>(
        operatorResponse?.isAddressed,
        {
          validators: GovukValidators.required(
            'Select yes if you have addressed this recommendation or plan to in the future',
          ),
        },
      ),
      addressedDate: formBuilder.control<Date | null>(
        !isNil(operatorResponse?.addressedDate) ? new Date(operatorResponse.addressedDate) : null,
        {
          validators: GovukValidators.required('Enter a date'),
        },
      ),
      addressedDescription: formBuilder.control<RespondToRecommendationFormModel['addressedDescription'] | null>(
        operatorResponse?.addressedDescription,
        {
          validators: [
            addressedDescriptionValidator(),
            GovukValidators.maxLength(10000, 'Enter up to 10000 characters'),
          ],
        },
      ),
    });
  },
};
