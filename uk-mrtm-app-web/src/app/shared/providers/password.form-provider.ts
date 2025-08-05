import { FactoryProvider, InjectionToken } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';

import { GovukValidators } from '@netz/govuk-components';

import { PasswordService } from '@shared/services';

export const PASSWORD_FORM = new InjectionToken<UntypedFormGroup>('Password form');

export const passwordFormProvider: FactoryProvider = {
  provide: PASSWORD_FORM,
  useFactory: (fb: UntypedFormBuilder, passwordService: PasswordService) =>
    fb.group(
      {
        email: [{ value: null, disabled: true }],
        password: [
          null,
          {
            validators: [
              GovukValidators.required('Please enter your password'),
              GovukValidators.minLength(12, 'Password must be 12 characters or more'),
              (control) => passwordService.strong(control),
            ],
            asyncValidators: (control) => passwordService.blacklisted(control),
            updateOn: 'change',
          },
        ],
        validatePassword: [null, { validators: GovukValidators.required('Re-enter your password') }],
      },
      {
        validators: GovukValidators.builder(
          'Password and re-typed password do not match. Please enter both passwords again',
          (group: UntypedFormGroup) => {
            const password = group.get('password');
            const validatePassword = group.get('validatePassword');

            return password.value === validatePassword.value ? null : { notEquivalent: true };
          },
        ),
      },
    ),
  deps: [UntypedFormBuilder, PasswordService],
};
