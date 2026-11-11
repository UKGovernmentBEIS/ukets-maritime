import { InjectionToken, Provider } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { VerifierUserDTO } from '@mrtm/api';

import { GovukValidators } from '@netz/govuk-components';

import { VerifierUserStore } from '@service-access/verifiers/+state/verifier-user.store';
import { phoneInputValidators } from '@shared/validators';

export const VERIFIER_USER_EDIT_FORM: InjectionToken<string> = new InjectionToken<string>('Edit user authority form');

export const verifierUserEditFormProvider: Provider = {
  provide: VERIFIER_USER_EDIT_FORM,
  deps: [FormBuilder, VerifierUserStore],
  useFactory: (
    formBuilder: FormBuilder,
    store: VerifierUserStore,
  ): FormGroup<Record<keyof Omit<VerifierUserDTO, 'termsVersion'>, FormControl>> => {
    const newUserAuthority = store.getState().currentVerifierUser;

    return formBuilder.group({
      firstName: new FormControl<VerifierUserDTO['firstName']>(newUserAuthority?.firstName, [
        GovukValidators.required("Enter user's first name"),
        GovukValidators.maxLength(255, 'First name should not be more than 255 characters'),
      ]),
      lastName: new FormControl<VerifierUserDTO['lastName']>(newUserAuthority?.lastName, [
        GovukValidators.required("Enter user's last name"),
        GovukValidators.maxLength(255, 'Last name should not be more than 255 characters'),
      ]),
      email: new FormControl<VerifierUserDTO['email']>({ value: newUserAuthority?.email, disabled: true }, [
        GovukValidators.required(`Enter user's email address`),
        GovukValidators.email('Enter an email address in the correct format, like name@example.com'),
        GovukValidators.maxLength(255, 'Email should not be more than 255 characters'),
      ]),
      phoneNumber: new FormControl<VerifierUserDTO['phoneNumber']>(newUserAuthority?.phoneNumber, [
        GovukValidators.empty('Enter phone number'),
        ...phoneInputValidators,
        GovukValidators.maxLength(255, 'Phone number should not be more than 255 characters'),
      ]),
      mobileNumber: new FormControl<VerifierUserDTO['mobileNumber']>(newUserAuthority?.mobileNumber, [
        ...phoneInputValidators,
        GovukValidators.maxLength(255, 'Mobile number should not be more than 255 characters'),
      ]),
    });
  },
};
