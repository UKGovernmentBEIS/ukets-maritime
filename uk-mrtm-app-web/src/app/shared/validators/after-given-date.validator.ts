import { AbstractControl, ValidatorFn } from '@angular/forms';

export const afterGivenDateValidator = (
  givenDate: Date,
  targetDateTitle: string,
  comparisonDateTitle: string,
): ValidatorFn => {
  return (control: AbstractControl): { [key: string]: string } | null => {
    return control.value && control.value <= givenDate
      ? { invalidDate: `The ${targetDateTitle} must be after the ${comparisonDateTitle}` }
      : null;
  };
};
