import { FormControl } from '@angular/forms';

import { AddressDTO, AddressStateDTO, MrtmAccountDTO, MrtmAccountUpdateDTO } from '@mrtm/api';

import { GovukValidators } from '@netz/govuk-components';

type LocationFormType = (AddressDTO | MrtmAccountDTO | MrtmAccountUpdateDTO | AddressStateDTO) & { state?: string };

export const getLocationStateFormGroup = (state: LocationFormType): Record<keyof LocationFormType, FormControl> => ({
  line1: new FormControl<LocationFormType['line1'] | null>(state?.line1, {
    validators: [
      GovukValidators.required('Enter address line 1, typically the building and street'),
      GovukValidators.maxLength(256, 'Address line 1 should not be more than 256 characters'),
    ],
  }),
  line2: new FormControl<LocationFormType['line2'] | null>(state?.line2, {
    validators: GovukValidators.maxLength(256, 'Address line 2 should not be more than 256 characters'),
  }),
  city: new FormControl<LocationFormType['city'] | null>(state?.city, {
    validators: [
      GovukValidators.required('Enter town or city'),
      GovukValidators.maxLength(256, 'Town or city should not be more than 256 characters'),
    ],
  }),
  country: new FormControl<LocationFormType['country'] | null>(state?.country, {
    validators: [
      GovukValidators.required('Enter a country'),
      GovukValidators.maxLength(256, 'Country should not be more than 256 characters'),
    ],
  }),
  state: new FormControl<LocationFormType['state'] | null>(state?.state, {
    validators: GovukValidators.maxLength(256, 'State, province or region should not be more than 256 characters'),
  }),
  postcode: new FormControl<LocationFormType['postcode'] | null>(state?.postcode, {
    validators: GovukValidators.maxLength(20, 'Postal or zip code should not be more than 20 characters'),
  }),
});
