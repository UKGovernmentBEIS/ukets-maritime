import { Provider } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import {
  TIME_INPUT_FORM,
  TimeInputFormGroupModel,
  TimeInputFormModel,
} from '@shared/components/time-input/time-input.types';

export const timeInputFormProvider: Provider = {
  provide: TIME_INPUT_FORM,
  deps: [FormBuilder],
  useFactory: (formBuilder: FormBuilder): FormGroup<TimeInputFormGroupModel> => {
    const date = new Date();
    return formBuilder.group<TimeInputFormGroupModel>(
      {
        day: formBuilder.control<TimeInputFormModel['day'] | null>({ value: date.getDate(), disabled: true }),
        month: formBuilder.control<TimeInputFormModel['month'] | null>({ value: date.getMonth() + 1, disabled: true }),
        year: formBuilder.control<TimeInputFormModel['year'] | null>({ value: date.getFullYear(), disabled: true }),
        hours: formBuilder.control<TimeInputFormModel['hours'] | null>(null),
        minutes: formBuilder.control<TimeInputFormModel['minutes'] | null>(null),
        seconds: formBuilder.control<TimeInputFormModel['seconds'] | null>(null),
      },
      { updateOn: 'change' },
    );
  },
};
