import { Provider } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { EmissionsMonitoringPlan } from '@mrtm/api';

import { RequestTaskStore } from '@netz/common/store';
import { GovukValidators } from '@netz/govuk-components';

import { empVariationRegulatorQuery } from '@requests/common/emp/+state';
import { subtaskReviewGroupMap } from '@requests/common/emp/utils';
import {
  VARIATION_REGULATOR_DECISION_FORM,
  VariationRegulatorDecisionFormModel,
  VariationScheduleItemFormModel,
} from '@requests/tasks/emp-variation-regulator/components';
import { atLeastOneRequiredValidator } from '@shared/validators';

export function variationRegulatorDecisionFormProvider(subTask: keyof EmissionsMonitoringPlan): Provider {
  return {
    provide: VARIATION_REGULATOR_DECISION_FORM,
    deps: [FormBuilder, RequestTaskStore],
    useFactory: (fb: FormBuilder, store: RequestTaskStore): VariationRegulatorDecisionFormModel => {
      const reviewGroup = subtaskReviewGroupMap[subTask];
      const variationDecision = store.select(
        empVariationRegulatorQuery.selectVariationRegulatorReviewGroupDecisions,
      )()?.[reviewGroup];

      return fb.group(
        {
          variationScheduleItems: fb.array(
            variationDecision?.variationScheduleItems?.map((scheduledItem) =>
              createAnotherScheduleItem(scheduledItem),
            ) ?? [],
          ),
          notes: fb.control(variationDecision?.notes ?? null, [
            GovukValidators.maxLength(10000, 'Enter up to 10000 characters'),
          ]),
        },
        { updateOn: 'change' },
      );
    },
  };
}

export function createAnotherScheduleItem(scheduledItem?: string): FormGroup<VariationScheduleItemFormModel> {
  return new FormGroup(
    {
      item: new FormControl(scheduledItem ?? null, [
        GovukValidators.required('Enter the change required by the operator'),
        GovukValidators.maxLength(10000, 'Enter up to 10000 characters'),
      ]),
    },
    {
      validators: [atLeastOneRequiredValidator('You must add an item to the list of changes required.')],
      updateOn: 'change',
    },
  );
}
