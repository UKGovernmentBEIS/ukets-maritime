import { Provider } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { MeasurementDescription } from '@mrtm/api';

import { RequestTaskStore } from '@netz/common/store';
import { GovukValidators } from '@netz/govuk-components';

import { empCommonQuery } from '@requests/common/emp/+state';
import {
  MeasurementDescriptionFormGroup,
  MeasurementDescriptionFormModel,
  MeasurementsFormModel,
} from '@requests/common/emp/subtasks/emissions/measurements/measurements.types';
import { TASK_FORM } from '@requests/common/task-form.token';

export const measurementsFormProvider: Provider = {
  provide: TASK_FORM,
  deps: [FormBuilder, RequestTaskStore, ActivatedRoute],
  useFactory: (fb: FormBuilder, store: RequestTaskStore, activatedRoute: ActivatedRoute) => {
    const shipId = activatedRoute.snapshot.params.shipId;
    const measurements = store.select(empCommonQuery.selectShipMeasurements(shipId))();

    const measurementDescriptionsFormGroups = measurements?.length
      ? measurements.map((item) => addMeasurementDescriptionGroup(item))
      : [addMeasurementDescriptionGroup()];
    return fb.group<MeasurementsFormModel>({
      measurements: fb.array(measurementDescriptionsFormGroups),
    });
  },
};

export const addMeasurementDescriptionGroup = (
  measurementDescription?: MeasurementDescription,
): MeasurementDescriptionFormGroup => {
  return new FormGroup<MeasurementDescriptionFormModel>({
    name: new FormControl(measurementDescription?.name ?? null, {
      validators: [
        GovukValidators.required('Enter the name of the measurement device'),
        GovukValidators.maxLength(250, 'Enter up to 250 characters'),
      ],
    }),
    technicalDescription: new FormControl(measurementDescription?.technicalDescription ?? null, {
      validators: [GovukValidators.maxLength(10000, 'Enter up to 10000 characters')],
    }),
    emissionSources: new FormControl(measurementDescription?.emissionSources ?? null, {
      validators: [GovukValidators.required('Select the emission source this device is used for')],
    }),
  });
};
