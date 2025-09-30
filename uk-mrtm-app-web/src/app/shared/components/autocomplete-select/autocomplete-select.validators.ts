import { FormControl, ValidatorFn } from '@angular/forms';

import { GovukValidators, MessageValidatorFn } from '@netz/govuk-components';

import { AutocompleteSelectOption } from '@shared/components/autocomplete-select/autocomplete-select.interface';

export class AutocompleteSelectValidators {
  static validOption(message: string): MessageValidatorFn {
    return GovukValidators.builder(message, this.validAutocompleteOptionValidator());
  }

  static validOptionOrEmpty(message: string): MessageValidatorFn {
    return GovukValidators.builder(message, this.validAutocompleteOptionOrEmptyValidator());
  }

  private static validAutocompleteOptionValidator(): ValidatorFn {
    return (control: FormControl<AutocompleteSelectOption>): { [key: string]: boolean } | null => {
      const value: AutocompleteSelectOption = control.value;
      return value?.data === null || value?.data === undefined ? { validAutocompleteOption: true } : null;
    };
  }

  private static validAutocompleteOptionOrEmptyValidator(): ValidatorFn {
    return (control: FormControl<AutocompleteSelectOption>): { [key: string]: boolean } | null => {
      const value: AutocompleteSelectOption = control.value;
      return (value?.data === null || value?.data === undefined) && value?.text !== ''
        ? { validAutocompleteOptionOrEmpty: true }
        : null;
    };
  }
}
