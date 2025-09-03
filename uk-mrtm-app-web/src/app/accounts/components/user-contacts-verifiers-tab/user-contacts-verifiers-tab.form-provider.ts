import { InjectionToken, Provider } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';

import { GovukValidators } from '@netz/govuk-components';

import {
  activeContactValidator,
  activeOperatorAdminValidator,
  primarySecondaryValidator,
} from '@accounts/components/user-contacts-verifiers-tab/user-contacts-verifiers-tab.validators';

export const USER_CONTACTS_VERIFIERS_FORM: InjectionToken<string> = new InjectionToken<string>(
  'User contacts verifiers form',
);

export const userContactsVerifiersTabFormProvider: Provider = {
  provide: USER_CONTACTS_VERIFIERS_FORM,
  deps: [UntypedFormBuilder],
  useFactory: (fb: UntypedFormBuilder) => {
    return fb.group(
      {
        usersArray: fb.array([]),
        contactTypes: fb.group(
          {
            PRIMARY: [null, GovukValidators.required('You must have a primary contact on your account')],
            SECONDARY: [],
            SERVICE: [null, GovukValidators.required('You must have a service contact on your account')],
            FINANCIAL: [null, GovukValidators.required('You must have a financial contact on your account')],
          },
          { updateOn: 'change' },
        ),
      },
      {
        validators: [
          activeOperatorAdminValidator('The account must have at least one operator admin user'),
          primarySecondaryValidator(
            'You cannot assign the same user as a primary and secondary contact on your account',
          ),
          activeContactValidator('PRIMARY'),
          activeContactValidator('SECONDARY'),
          activeContactValidator('SERVICE'),
          activeContactValidator('FINANCIAL'),
        ],
      },
    );
  },
};
