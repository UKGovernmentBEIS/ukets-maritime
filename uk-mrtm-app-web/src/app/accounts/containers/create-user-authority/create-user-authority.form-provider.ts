import { InjectionToken, Provider } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { OperatorUserInvitationDTO } from '@mrtm/api';

import { GovukValidators } from '@netz/govuk-components';

import { UserAuthorityStore } from '@accounts/store';

export const CREATE_USER_AUTHORITY_PROVIDER: InjectionToken<string> = new InjectionToken<string>(
  'Create user authority form',
);

export const createUserAuthorityFormProvider: Provider = {
  provide: CREATE_USER_AUTHORITY_PROVIDER,
  deps: [FormBuilder, UserAuthorityStore],
  useFactory: (
    formBuilder: FormBuilder,
    store: UserAuthorityStore,
  ): FormGroup<Record<keyof Omit<OperatorUserInvitationDTO, 'roleCode'>, FormControl>> => {
    const newUserAuthority = store.getState().createUserAuthority?.newUserAuthority;

    return formBuilder.group({
      firstName: new FormControl<OperatorUserInvitationDTO['firstName']>(newUserAuthority?.firstName, [
        GovukValidators.required("Enter user's first name"),
        GovukValidators.maxLength(255, 'First name should not be more than 255 characters'),
      ]),
      lastName: new FormControl<OperatorUserInvitationDTO['lastName']>(newUserAuthority?.lastName, [
        GovukValidators.required("Enter user's last name"),
        GovukValidators.maxLength(255, 'Last name should not be more than 255 characters'),
      ]),
      email: new FormControl<OperatorUserInvitationDTO['email']>(newUserAuthority?.email, [
        GovukValidators.required(`Enter user's email address`),
        GovukValidators.email('Enter an email address in the correct format, like name@example.com'),
        GovukValidators.maxLength(255, 'Email should not be more than 255 characters'),
      ]),
    });
  },
};
