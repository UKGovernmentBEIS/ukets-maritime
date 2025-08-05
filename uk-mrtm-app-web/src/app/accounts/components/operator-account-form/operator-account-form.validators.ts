import { DateInputValidators, GovukValidators, MessageValidatorFn } from '@netz/govuk-components';

export const minYearValidator = (minYear: string): MessageValidatorFn => {
  const minDate = new Date(Date.UTC(+minYear, 0, 1, 0, 0, 0, 0));
  return GovukValidators.builder(
    `The year must be after or equal to ${minYear}`,
    DateInputValidators.minMaxDateValidator(minDate, null),
  );
};
