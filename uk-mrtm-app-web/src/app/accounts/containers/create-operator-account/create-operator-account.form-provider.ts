import { InjectionToken, Provider } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AbstractControl, AsyncValidatorFn, FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { map } from 'rxjs';

import { MaritimeAccountsService, MrtmAccountDTO } from '@mrtm/api';

import { GovukValidators } from '@netz/govuk-components';

import { minYearValidator } from '@accounts/components/operator-account-form';
import { OperatorAccountsStore } from '@accounts/store';
import { ConfigService } from '@core/config';
import { getLocationStateFormGroup } from '@shared/components';

export const CREATE_OPERATOR_ACCOUNT_FORM: InjectionToken<string> = new InjectionToken('Create operator account form');

export const createOperatorAccountFormProvider: Provider = {
  provide: CREATE_OPERATOR_ACCOUNT_FORM,
  deps: [FormBuilder, OperatorAccountsStore, MaritimeAccountsService, ConfigService],
  useFactory: (
    formBuilder: FormBuilder,
    store: OperatorAccountsStore,
    service: MaritimeAccountsService,
    configService: ConfigService,
  ): FormGroup<Record<keyof MrtmAccountDTO, FormControl>> => {
    const newOperatorAccount = store.getState().createAccount?.newAccount;

    const uniqueImoNumberValidator: AsyncValidatorFn = (control: AbstractControl) =>
      service
        .isExistingAccountImoNumber(control.value)
        .pipe(
          map((res) =>
            res ? { imoNumber: 'Enter a different company IMO number. This one is already in use' } : null,
          ),
        );

    return formBuilder.group({
      imoNumber: new FormControl<MrtmAccountDTO['imoNumber'] | null>(newOperatorAccount?.imoNumber, {
        validators: [
          GovukValidators.required('Enter company’s IMO Number'),
          GovukValidators.pattern(/^\d{7}$/, 'Enter a 7 digit number'),
        ],
        asyncValidators: [uniqueImoNumberValidator],
      }),
      name: new FormControl<MrtmAccountDTO['name'] | null>(newOperatorAccount?.name, {
        validators: [
          GovukValidators.required('Enter operator’s name'),
          GovukValidators.maxLength(256, 'Operator name should not be more than 256 characters'),
        ],
      }),
      firstMaritimeActivityDate: new FormControl<MrtmAccountDTO['firstMaritimeActivityDate'] | null>(
        newOperatorAccount?.firstMaritimeActivityDate,
        {
          validators: [
            GovukValidators.required('Enter the first year of reporting obligation'),
            minYearValidator(toSignal(configService.getConfigProperty('minYearOfFirstMrtmActivity'))()),
          ],
        },
      ),
      ...getLocationStateFormGroup(newOperatorAccount),
    });
  },
};
