import { InjectionToken, Provider } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';

import { AddressDTO, VerificationBodyDTO } from '@mrtm/api';

import { GovukValidators } from '@netz/govuk-components';

import { VerificationBodiesStoreService } from '@verification-bodies/+state/verification-bodies-store.service';

export const EDIT_VERIFICATION_BODY_PROVIDER: InjectionToken<string> = new InjectionToken('Edit verification body');

export const editVerificationBodyFormProvider: Provider = {
  provide: EDIT_VERIFICATION_BODY_PROVIDER,
  deps: [FormBuilder, VerificationBodiesStoreService],
  useFactory: (formBuilder: FormBuilder, store: VerificationBodiesStoreService) => {
    const state = store.getState().currentVerificationBody.verificationBody;

    return formBuilder.group({
      id: new FormControl<VerificationBodyDTO['id'] | null>(state?.id),
      status: new FormControl<VerificationBodyDTO['status'] | null>(state?.status),
      name: new FormControl<VerificationBodyDTO['name'] | null>(state?.name, {
        validators: [
          GovukValidators.required('Enter the name of the verification body organisation'),
          GovukValidators.maxLength(
            25,
            'Name of the verification body organisation should not be more than 25 characters',
          ),
        ],
      }),
      accreditationReferenceNumber: new FormControl<VerificationBodyDTO['accreditationReferenceNumber'] | null>(
        state?.accreditationReferenceNumber,
        {
          validators: [
            GovukValidators.required('Enter the accreditation reference number'),
            GovukValidators.maxLength(25, 'Accreditation reference number should not be more than 25 characters'),
          ],
        },
      ),
      address: formBuilder.group<Record<keyof VerificationBodyDTO['address'], FormControl>>({
        line1: new FormControl<AddressDTO['line1'] | null>(state?.address?.line1, {
          validators: [
            GovukValidators.required('Enter an address '),
            GovukValidators.maxLength(256, 'Address line 1 should not be more than 256 characters'),
          ],
        }),
        line2: new FormControl<AddressDTO['line2'] | null>(state?.address?.line2, {
          validators: GovukValidators.maxLength(256, 'Address line 2 should not be more than 256 characters'),
        }),
        city: new FormControl<AddressDTO['city'] | null>(state?.address?.city, {
          validators: [
            GovukValidators.required('Enter a town or city'),
            GovukValidators.maxLength(256, 'Town or city should not be more than 256 characters'),
          ],
        }),
        country: new FormControl<AddressDTO['country'] | null>(state?.address?.country, {
          validators: [
            GovukValidators.required('Enter a country'),
            GovukValidators.maxLength(256, 'Country should not be more than 256 characters'),
          ],
        }),
        postcode: new FormControl<AddressDTO['postcode'] | null>(state?.address?.postcode, {
          validators: [
            GovukValidators.required('Enter a postal or zip code'),
            GovukValidators.maxLength(64, 'Postal or zip code should not be more than 64 characters'),
          ],
        }),
      }),
    });
  },
};
