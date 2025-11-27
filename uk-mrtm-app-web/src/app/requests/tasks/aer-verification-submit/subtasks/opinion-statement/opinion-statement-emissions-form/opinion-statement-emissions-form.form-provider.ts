import { Provider } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidatorFn } from '@angular/forms';

import { clone, isEmpty } from 'lodash-es';

import { AerOpinionStatement } from '@mrtm/api';

import { RequestTaskStore } from '@netz/common/store';
import { GovukValidators } from '@netz/govuk-components';

import { TASK_FORM } from '@requests/common/task-form.token';
import { aerVerificationSubmitQuery } from '@requests/tasks/aer-verification-submit/+state/aer-verification-submit.selectors';

export type AerOpinionStatementTotalEmissionsFormModel = Record<
  keyof Pick<
    AerOpinionStatement,
    | 'emissionsCorrect'
    | 'manuallyProvidedTotalEmissions'
    | 'manuallyProvidedSurrenderEmissions'
    | 'manuallyProvidedLessVoyagesInNorthernIrelandDeduction'
  >,
  FormControl
>;

const niDeductionLessThanTotalEmissionsValidator = (): ValidatorFn => {
  return (group: FormGroup<AerOpinionStatementTotalEmissionsFormModel>) => {
    const emissionsCorrectCtrl = group.controls.emissionsCorrect;
    const niDeductionCtrl = group.controls.manuallyProvidedLessVoyagesInNorthernIrelandDeduction;
    const totalEmissionsCtrl = group.controls.manuallyProvidedTotalEmissions;

    if (emissionsCorrectCtrl.value === true) {
      return null;
    }

    if (Number(niDeductionCtrl.value) > Number(totalEmissionsCtrl.value)) {
      niDeductionCtrl.setErrors({
        ...niDeductionCtrl.errors,
        invalidLessVoyagesInNorthernIrelandDeduction: `The verified Northern Ireland surrender deduction must be less than or equal to the total maritime emissions`,
      });
    } else {
      if (niDeductionCtrl.errors?.invalidLessVoyagesInNorthernIrelandDeduction) {
        delete niDeductionCtrl.errors.invalidLessVoyagesInNorthernIrelandDeduction;
        const existingErrors = clone(niDeductionCtrl.errors);
        // Workaround to trigger the UI refresh on `govuk-error-message`
        // Sets it to null, then sets it to previous errors if they exist
        niDeductionCtrl.setErrors(null);
        if (!isEmpty(existingErrors)) {
          niDeductionCtrl.setErrors(existingErrors);
        }
      }
    }

    return null;
  };
};

const surrenderEmissionsLessThanNIDeductionValidator = (): ValidatorFn => {
  return (group: FormGroup<AerOpinionStatementTotalEmissionsFormModel>) => {
    const emissionsCorrectCtrl = group.controls.emissionsCorrect;
    const surrenderEmissionsCtrl = group.controls.manuallyProvidedSurrenderEmissions;
    const niDeductionCtrl = group.controls.manuallyProvidedLessVoyagesInNorthernIrelandDeduction;

    if (emissionsCorrectCtrl.value === true) {
      return null;
    }

    if (Number(surrenderEmissionsCtrl.value) > Number(niDeductionCtrl.value)) {
      surrenderEmissionsCtrl.setErrors({
        ...surrenderEmissionsCtrl.errors,
        invalidSurrenderEmissions: `The verified emissions figure for surrender must be less than or equal to the Northern Ireland surrender deduction`,
      });
    } else {
      if (surrenderEmissionsCtrl.errors?.invalidSurrenderEmissions) {
        delete surrenderEmissionsCtrl.errors.invalidSurrenderEmissions;
        const existingErrors = clone(surrenderEmissionsCtrl.errors);
        // Workaround to trigger the UI refresh on `govuk-error-message`
        // Sets it to null, then sets it to previous errors if they exist
        surrenderEmissionsCtrl.setErrors(null);
        if (!isEmpty(existingErrors)) {
          surrenderEmissionsCtrl.setErrors(existingErrors);
        }
      }
    }

    return null;
  };
};

export const opinionStatementEmissionsFormProvider: Provider = {
  provide: TASK_FORM,
  deps: [FormBuilder, RequestTaskStore],
  useFactory: (
    formBuilder: FormBuilder,
    store: RequestTaskStore,
  ): FormGroup<AerOpinionStatementTotalEmissionsFormModel> => {
    const opinionStatement = store.select(aerVerificationSubmitQuery.selectOpinionStatement)();

    return formBuilder.group(
      {
        emissionsCorrect: formBuilder.control<boolean>(opinionStatement?.emissionsCorrect, {
          validators: [
            GovukValidators.required('Select yes if the reported and surrender obligation emissions are correct'),
          ],
        }),
        manuallyProvidedTotalEmissions: formBuilder.control<string>(
          opinionStatement?.manuallyProvidedTotalEmissions ?? null,
          {
            validators: [
              GovukValidators.required('Enter the total verified maritime emissions for the scheme year'),
              GovukValidators.integerNumber(
                'The total verified maritime emissions must be a whole number equal to or greater than 0',
              ),
            ],
          },
        ),
        manuallyProvidedLessVoyagesInNorthernIrelandDeduction: formBuilder.control<string>(
          opinionStatement?.manuallyProvidedLessVoyagesInNorthernIrelandDeduction ?? null,
          {
            validators: [
              GovukValidators.required('Enter the verified Northern Ireland surrender deduction'),
              GovukValidators.integerNumber(
                'The verified Northern Ireland surrender deduction must be a whole number equal to or greater than 0',
              ),
            ],
          },
        ),
        manuallyProvidedSurrenderEmissions: formBuilder.control<string>(
          opinionStatement?.manuallyProvidedSurrenderEmissions ?? null,
          {
            validators: [
              GovukValidators.required('Enter the verified emissions figure for surrender for the scheme year'),
              GovukValidators.integerNumber(
                'The verified emissions figure for surrender must be a whole number equal to or greater than 0',
              ),
            ],
          },
        ),
      },
      {
        validators: [niDeductionLessThanTotalEmissionsValidator(), surrenderEmissionsLessThanNIDeductionValidator()],
      },
    );
  },
};
