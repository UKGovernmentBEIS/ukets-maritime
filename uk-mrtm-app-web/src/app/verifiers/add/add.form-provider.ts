import { InjectionToken, Provider } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { VerifierUserInvitationDTO } from '@mrtm/api';

import { GovukValidators } from '@netz/govuk-components';

import { phoneInputValidators } from '@shared/validators';
import { VerifierUserStore } from '@verifiers/+state/verifier-user.store';

export const ADD_USER_AUTHORITY_PROVIDER: InjectionToken<string> = new InjectionToken<string>(
  'Add user authority form',
);

export const addFormProvider: Provider = {
  provide: ADD_USER_AUTHORITY_PROVIDER,
  deps: [FormBuilder, VerifierUserStore],
  useFactory: (
    formBuilder: FormBuilder,
    store: VerifierUserStore,
  ): FormGroup<Record<keyof Omit<VerifierUserInvitationDTO, 'roleCode'>, FormControl>> => {
    const newUserAuthority = store.getState().createVerifierUser?.newUserAuthority;

    return formBuilder.group({
      firstName: new FormControl<VerifierUserInvitationDTO['firstName']>(newUserAuthority?.firstName, [
        GovukValidators.required("Enter user's first name"),
        GovukValidators.maxLength(255, 'First name should not be more than 255 characters'),
      ]),
      lastName: new FormControl<VerifierUserInvitationDTO['lastName']>(newUserAuthority?.lastName, [
        GovukValidators.required("Enter user's last name"),
        GovukValidators.maxLength(255, 'Last name should not be more than 255 characters'),
      ]),
      email: new FormControl<VerifierUserInvitationDTO['email']>(newUserAuthority?.email, [
        GovukValidators.required(`Enter user's email address`),
        GovukValidators.email('Enter an email address in the correct format, like name@example.com'),
        GovukValidators.maxLength(255, 'Email should not be more than 255 characters'),
      ]),
      phoneNumber: new FormControl<VerifierUserInvitationDTO['phoneNumber']>(newUserAuthority?.phoneNumber, [
        GovukValidators.empty('Enter user’s telephone number'),
        ...phoneInputValidators,
        GovukValidators.maxLength(255, 'Phone number should not be more than 255 characters'),
      ]),
      mobileNumber: new FormControl<VerifierUserInvitationDTO['mobileNumber']>(newUserAuthority?.mobileNumber, [
        ...phoneInputValidators,
        GovukValidators.maxLength(255, 'Mobile number should not be more than 255 characters'),
      ]),
    });
  },
};
