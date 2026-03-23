import { InjectionToken, Provider } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { OperatorUserDTO } from '@mrtm/api';

import { GovukValidators } from '@netz/govuk-components';

import { UserAuthorityStore } from '@accounts/store';
import { phoneInputValidators } from '@shared/validators';

export const EDIT_USER_AUTHORITY_FORM: InjectionToken<string> = new InjectionToken<string>('Edit user authority form');

export const editUserAuthorityFormProvider: Provider = {
  provide: EDIT_USER_AUTHORITY_FORM,
  deps: [FormBuilder, UserAuthorityStore],
  useFactory: (
    formBuilder: FormBuilder,
    store: UserAuthorityStore,
  ): FormGroup<Record<keyof Omit<OperatorUserDTO, 'authorityStatus' | 'termsVersion' | 'status'>, FormControl>> => {
    const currentUser = store.getState().currentUserAuthority;
    return formBuilder.group({
      firstName: new FormControl<OperatorUserDTO['firstName']>(currentUser?.firstName, [
        GovukValidators.required("Enter user's first name"),
        GovukValidators.maxLength(255, 'First name should not be more than 255 characters'),
      ]),
      lastName: new FormControl<OperatorUserDTO['lastName']>(currentUser?.lastName, [
        GovukValidators.required("Enter user's last name"),
        GovukValidators.maxLength(255, 'Last name should not be more than 255 characters'),
      ]),
      email: new FormControl<OperatorUserDTO['email']>({ value: currentUser?.email, disabled: true }, [
        GovukValidators.required(`Enter user's email address`),
        GovukValidators.email('Enter an email address in the correct format, like name@example.com'),
        GovukValidators.maxLength(255, 'Email should not be more than 255 characters'),
      ]),
      phoneNumber: new FormControl<OperatorUserDTO['phoneNumber']>(currentUser?.phoneNumber, [
        GovukValidators.empty('Enter phone number'),
        ...phoneInputValidators,
        GovukValidators.maxLength(255, 'Phone number should not be more than 255 characters'),
      ]),
      mobileNumber: new FormControl<OperatorUserDTO['mobileNumber']>(currentUser?.mobileNumber, [
        ...phoneInputValidators,
        GovukValidators.maxLength(255, 'Mobile number should not be more than 255 characters'),
      ]),
    });
  },
};
