import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

import { PhoneNumberUtil } from 'google-libphonenumber';

import { GovukValidators, MessageValidatorFn } from '@netz/govuk-components';

const phoneNumberSizeValidator = (): ValidatorFn => {
  return (control: AbstractControl): { [key: string]: string } | null => {
    return control.value?.number?.length > 255
      ? { invalidSize: `Your phone number should not be larger than 255 characters` }
      : null;
  };
};

const phoneNumberValidatorWithSeparateCountryCodeAndPhoneNumberFields = (): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    const phoneNumberUtil = PhoneNumberUtil.getInstance();

    // If the fields are not filled, return null
    if (!control.value?.countryCode || !control.value?.number) {
      return null;
    }

    const countryCode = control.value.countryCode;
    const phone = control.value.number;

    // Regex to check for valid phone number characters
    const phoneNumberRegex = new RegExp('^[\\d \\-()]*$');

    // Check for invalid characters
    const isPhoneNumber = phoneNumberRegex.test(phone);
    if (!isPhoneNumber) {
      return { invalidChars: 'The phone number contains invalid characters' };
    }

    let validNumber = false;
    let validationResult;
    try {
      const regionCode = phoneNumberUtil.getRegionCodeForCountryCode(countryCode);
      const phoneNumber = phoneNumberUtil.parseAndKeepRawInput(phone, regionCode);
      validNumber = phoneNumberUtil.isValidNumber(phoneNumber);
      validationResult = phoneNumberUtil.isPossibleNumberWithReason(phoneNumber);
    } catch (e) {
      return { invalidPhone: 'Your phone number is not valid' };
    }
    if (!validNumber) {
      switch (validationResult) {
        case PhoneNumberUtil.ValidationResult.TOO_SHORT:
          return { tooShort: 'The phone number is too short for your country code' };
        case PhoneNumberUtil.ValidationResult.TOO_LONG:
          return { tooLong: 'The phone number is too long for your country code' };
        case PhoneNumberUtil.ValidationResult.INVALID_LENGTH:
          return { invalidLength: 'The phone number length is invalid' };
        default:
          return { invalidPhone: 'Your phone number is not valid' };
      }
    }
    return null;
  };
};

/* const phoneNumberSingleFieldValidator = (): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    const phoneNumberUtil = PhoneNumberUtil.getInstance();
    const rawInput = control.value?.toString().trim();

    // If no input, don't validate (let required validator handle it if needed)
    if (!rawInput) {
      return null;
    }

    // Check for invalid characters
    const phoneNumberRegex = /^[\d\s\-()+]+$/;
    if (!phoneNumberRegex.test(rawInput)) {
      return { invalidChars: 'The phone number contains invalid characters' };
    }

    try {
      // Use default region 'GB' if no '+' prefix (i.e., not international format)
      const hasCountryCode = rawInput.startsWith('+');
      const parsedNumber = hasCountryCode
        ? phoneNumberUtil.parse(rawInput)
        : phoneNumberUtil.parseAndKeepRawInput(rawInput, 'GB');
      const isValid = phoneNumberUtil.isValidNumber(parsedNumber);

      if (!isValid) {
        const possibleReason = phoneNumberUtil.isPossibleNumberWithReason(parsedNumber);

        switch (possibleReason) {
          case PhoneNumberUtil.ValidationResult.TOO_SHORT:
            return { tooShort: 'The phone number is too short' };
          case PhoneNumberUtil.ValidationResult.TOO_LONG:
            return { tooLong: 'The phone number is too long' };
          case PhoneNumberUtil.ValidationResult.INVALID_LENGTH:
            return { invalidLength: 'The phone number length is invalid' };
          default:
            return { invalidPhone: 'Your phone number is not valid' };
        }
      }

      return null; // Valid phone number
    } catch (e) {
      return { invalidPhone: 'Your phone number is not valid' };
    }
  };
}; */

export const phoneInputWithCountyCodeSelectValidators: MessageValidatorFn[] = [
  GovukValidators.incomplete('Enter both country code and number'),
  phoneNumberSizeValidator(),
  phoneNumberValidatorWithSeparateCountryCodeAndPhoneNumberFields(),
];

export const phoneInputValidators: MessageValidatorFn[] = [
  phoneNumberSizeValidator(),
  // phoneNumberSingleFieldValidator(),
];
