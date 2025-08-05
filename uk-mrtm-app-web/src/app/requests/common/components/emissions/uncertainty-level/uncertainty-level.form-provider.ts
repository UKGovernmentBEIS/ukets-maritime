import { inject, Provider } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { UncertaintyLevel } from '@mrtm/api';

import { RequestTaskStore } from '@netz/common/store';
import { GovukValidators } from '@netz/govuk-components';

import { REQUEST_TASK_COMMON_SUBTASK_STEPS_QUERY } from '@requests/+state';
import {
  UncertaintyLevelFormModel,
  UncertaintyLevelItemFormModel,
} from '@requests/common/components/emissions/uncertainty-level/uncertainty-level.types';
import { TASK_FORM } from '@requests/common/task-form.token';
import { monitoringMethodMap } from '@shared/constants';

const getUncertaintyLevelFormModel = (
  uncertaintyLevel?: Partial<UncertaintyLevel>,
): FormGroup<UncertaintyLevelItemFormModel> =>
  new FormGroup<UncertaintyLevelItemFormModel>({
    monitoringMethod: new FormControl<UncertaintyLevel['monitoringMethod'] | null>(uncertaintyLevel?.monitoringMethod),
    methodApproach: new FormControl<UncertaintyLevel['methodApproach'] | null>(
      {
        value: uncertaintyLevel?.monitoringMethod === 'DIRECT' ? 'SHIP_SPECIFIC' : uncertaintyLevel?.methodApproach,
        disabled: uncertaintyLevel?.monitoringMethod === 'DIRECT',
      },
      { validators: [GovukValidators.required('Select the approach used for the monitoring method')] },
    ),
    value: new FormControl<UncertaintyLevel['value'] | null>(
      { value: uncertaintyLevel?.value ?? null, disabled: uncertaintyLevel?.methodApproach === 'DEFAULT' },
      {
        validators: [
          GovukValidators.required(
            `Enter a value % for ${monitoringMethodMap[uncertaintyLevel?.monitoringMethod]?.text}`,
          ),
          GovukValidators.pattern(
            /^(?!0\.0{1,2}$)([1-9][0-9]*(\.[0-9]{1,2})?|0\.[0-9]{1,2})$/,
            'Enter a positive number up to 2 decimal places',
          ),
          GovukValidators.notNaN('Enter a positive number up to 2 decimal places'),
          GovukValidators.percentageValidator(
            2,
            'The uncertainty value must be less or equal than 100% with up to 2 decimal places',
          ),
        ],
      },
    ),
  });

export const uncertaintyLevelFormProvider: Provider = {
  provide: TASK_FORM,
  deps: [FormBuilder, RequestTaskStore, ActivatedRoute],
  useFactory: (formBuilder: FormBuilder, store: RequestTaskStore, route: ActivatedRoute) => {
    const commonSubtaskStepsQuery = inject(REQUEST_TASK_COMMON_SUBTASK_STEPS_QUERY);
    const shipId = route.snapshot.params.shipId;

    const uncertaintyLevels = store.select(commonSubtaskStepsQuery.selectShip(shipId))()?.uncertaintyLevel;
    const monitoringMethods = store.select(commonSubtaskStepsQuery.selectShipMonitoringMethods(shipId))();

    return formBuilder.group<UncertaintyLevelFormModel>({
      shipId: formBuilder.control(shipId),
      uncertaintyLevels: formBuilder.array(
        monitoringMethods.map((monitoringMethod) => {
          const model = uncertaintyLevels?.find((item) => item.monitoringMethod === monitoringMethod);
          return getUncertaintyLevelFormModel(model ?? { monitoringMethod });
        }),
      ),
    });
  },
};
