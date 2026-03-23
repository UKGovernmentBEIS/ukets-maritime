import { FormGroup } from '@angular/forms';

import { isNil } from 'lodash-es';

import { TimeInputFormGroupModel, TimeInputFormModel } from '@shared/components/time-input/time-input.types';

const isInRange = (value: number, min: number, max: number): boolean => value >= min && value <= max;

const isEmpty = (form: FormGroup<TimeInputFormGroupModel>): boolean => {
  const { hours, minutes, seconds } = form.value;

  return isNil(hours) && isNil(minutes) && isNil(seconds);
};

const isIncomplete = (form: FormGroup<TimeInputFormGroupModel>): boolean => {
  const { hours, minutes, seconds } = form.value;

  return (
    (!isNil(hours) || !isNil(minutes) || !isNil(seconds)) &&
    (isNil(hours) ||
      isNil(minutes) ||
      isNil(seconds) ||
      `${hours}`.trim().length === 0 ||
      `${minutes}`.trim().length === 0 ||
      `${seconds}`.trim().length === 0)
  );
};

const isUnrealTime = (form: FormGroup<TimeInputFormGroupModel>): boolean => {
  const { hours, minutes, seconds } = form.value;

  return (
    (!isNil(hours) && !isInRange(hours, 0, 23)) ||
    (!isNil(minutes) && !isInRange(minutes, 0, 59)) ||
    (!isNil(seconds) && !isInRange(seconds, 0, 59))
  );
};

export const getCombinedTimeValidationResults = (formGroup: FormGroup<TimeInputFormGroupModel>, isRequired = false) => {
  return isRequired && isEmpty(formGroup)
    ? { isEmpty: true }
    : isIncomplete(formGroup)
      ? { isIncomplete: true }
      : isUnrealTime(formGroup) && !isEmpty(formGroup)
        ? { isUnrealTime: true }
        : undefined;
};

export const buildDateTime = ({ year, month, day, hours, minutes, seconds }: TimeInputFormModel): Date | null => {
  return isNil(year) || isNil(month) || isNil(day) || isNil(hours) || isNil(minutes) || isNil(seconds)
    ? null
    : new Date(
        Date.UTC(
          Number(year),
          Number(month) - 1,
          Number(day),
          Number(hours ?? 0),
          Number(minutes ?? 0),
          Number(seconds ?? 0),
          0,
        ),
      );
};
