import { InjectionToken, Provider } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { isNil } from 'lodash-es';

import { MrtmAccountUpdateDTO } from '@mrtm/api';

import { GovukValidators } from '@netz/govuk-components';

import { minYearValidator } from '@accounts/components/operator-account-form';
import { OperatorAccountsStore } from '@accounts/store';
import { ConfigService } from '@core/config';
import { getLocationStateFormGroup } from '@shared/components';

export const EDIT_OPERATOR_ACCOUNT_FORM: InjectionToken<string> = new InjectionToken('Edit operator account form');

export const editOperatorAccountFormProvider: Provider = {
  provide: EDIT_OPERATOR_ACCOUNT_FORM,
  deps: [FormBuilder, OperatorAccountsStore, ConfigService],
  useFactory: (
    formBuilder: FormBuilder,
    store: OperatorAccountsStore,
    configService: ConfigService,
  ): FormGroup<Record<keyof MrtmAccountUpdateDTO, FormControl>> => {
    const currentOperatorAccount = store.getState().currentAccount?.account;

    return formBuilder.group({
      name: new FormControl<MrtmAccountUpdateDTO['name'] | null>(currentOperatorAccount?.name, {
        validators: [
          GovukValidators.required('Enter operator’s name'),
          GovukValidators.maxLength(256, 'Operator name should not be more than 256 characters'),
        ],
      }),
      firstMaritimeActivityDate: new FormControl<MrtmAccountUpdateDTO['firstMaritimeActivityDate'] | Date | null>(
        !isNil(currentOperatorAccount?.firstMaritimeActivityDate)
          ? new Date(currentOperatorAccount?.firstMaritimeActivityDate)
          : null,
        {
          validators: [
            GovukValidators.required('Enter the first year of reporting obligation'),
            minYearValidator(toSignal(configService.getConfigProperty('minYearOfFirstMrtmActivity'))()),
          ],
        },
      ),
      sopId: new FormControl<MrtmAccountUpdateDTO['sopId'] | null>(currentOperatorAccount?.sopId, {
        validators: [
          GovukValidators.max(9999999999, 'The SOP ID should contain a maximum of 10 numbers'),
          GovukValidators.pattern(/^\d*$/, 'The SOP ID should contain numbers only'),
        ],
      }),
      ...getLocationStateFormGroup(currentOperatorAccount),
    });
  },
};
