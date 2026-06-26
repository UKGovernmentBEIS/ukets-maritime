import { FactoryProvider, InjectionToken } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';

import { map } from 'rxjs';

import { ForgotPasswordService, PasswordValidationResponseDTO } from '@mrtm/api';

import { GovukValidators } from '@netz/govuk-components';

import { PasswordStrengthMeterService } from '@shared/components/password-strength-meter/password-strength-meter.service';

export const PASSWORD_FORM = new InjectionToken<UntypedFormGroup>('Password form');

const apiPasswordErrorMap: Record<string, string> = {
  INVALID_MIN_LENGTH: 'Password must be 12 characters or more',
  INVALID_MAX_LENGTH: 'Password must be 127 characters or less',
  BLACKLISTED_PATTERN: 'Enter a password that does not contain words related to the service or your role',
  PWNED: 'Password has been blacklisted. Select another password',
  PWNED_SERVICE_UNAVAILABLE: 'Password check service is temporarily unavailable. Please try again later',
};

const apiPasswordErrorMapper = (response: PasswordValidationResponseDTO) => {
  if (response?.errors) {
    return response.errors.reduce(
      (acc, error) => {
        acc[error.code] = apiPasswordErrorMap?.[error.code] ?? error.message;
        return acc;
      },
      {} as Record<string, string>,
    );
  }
  return null;
};

export const passwordFormProvider: FactoryProvider = {
  provide: PASSWORD_FORM,
  deps: [UntypedFormBuilder, PasswordStrengthMeterService, ForgotPasswordService],
  useFactory: (
    fb: UntypedFormBuilder,
    passwordStrengthMeterService: PasswordStrengthMeterService,
    forgotPasswordService: ForgotPasswordService,
  ) => {
    const apiPasswordValidator: AsyncValidatorFn = (control: AbstractControl) =>
      forgotPasswordService
        .validatePassword({ password: control?.value })
        .pipe(map((res) => apiPasswordErrorMapper(res)));

    return fb.group(
      {
        email: [{ value: null, disabled: true }],
        password: [
          null,
          {
            validators: [
              GovukValidators.required('Please enter your password'),
              passwordStrengthMeterService.strongValidator(),
            ],
            asyncValidators: [apiPasswordValidator],
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
        updateOn: 'submit',
      },
    );
  },
};
