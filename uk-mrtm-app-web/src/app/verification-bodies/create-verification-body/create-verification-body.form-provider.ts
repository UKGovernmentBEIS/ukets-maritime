import { InjectionToken, Provider } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';

import { AddressDTO, AdminVerifierUserInvitationDTO, VerificationBodyCreationDTO } from '@mrtm/api';

import { GovukValidators } from '@netz/govuk-components';

import { phoneInputValidators } from '@shared/validators';
import { VerificationBodiesStoreService } from '@verification-bodies/+state/verification-bodies-store.service';

export const CREATE_VERIFICATION_BODY_PROVIDER: InjectionToken<string> = new InjectionToken<string>(
  'Create verification body form',
);

export const createVerificationBodyFormProvider: Provider = {
  provide: CREATE_VERIFICATION_BODY_PROVIDER,
  deps: [FormBuilder, VerificationBodiesStoreService],
  useFactory: (formBuilder: FormBuilder, store: VerificationBodiesStoreService) => {
    const state = store.getState().createVerificationBody?.newVerificationBody;
    return formBuilder.group({
      name: new FormControl<VerificationBodyCreationDTO['name'] | null>(state?.name, {
        validators: [
          GovukValidators.required('Enter the name of the verification body organisation'),
          GovukValidators.maxLength(
            25,
            'Name of the verification body organisation should not be more than 25 characters',
          ),
        ],
      }),
      accreditationReferenceNumber: new FormControl<VerificationBodyCreationDTO['accreditationReferenceNumber'] | null>(
        state?.accreditationReferenceNumber,
        {
          validators: [
            GovukValidators.required('Enter the accreditation reference number'),
            GovukValidators.maxLength(25, 'Accreditation reference number should not be more than 25 characters'),
          ],
        },
      ),
      address: formBuilder.group<Record<keyof VerificationBodyCreationDTO['address'], FormControl>>({
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
        postcode: new FormControl<AddressDTO['postcode'] | null>(state?.address?.postcode, {
          validators: [
            GovukValidators.required('Enter a postal or zip code'),
            GovukValidators.maxLength(64, 'Postal or zip code should not be more than 64 characters'),
          ],
        }),
        country: new FormControl<AddressDTO['country'] | null>(state?.address?.country, {
          validators: [
            GovukValidators.required('Enter a country'),
            GovukValidators.maxLength(256, 'Country should not be more than 256 characters'),
          ],
        }),
      }),
      adminVerifierUserInvitation: formBuilder.group<
        Record<keyof VerificationBodyCreationDTO['adminVerifierUserInvitation'], FormControl>
      >({
        firstName: new FormControl<AdminVerifierUserInvitationDTO['firstName']>(
          state?.adminVerifierUserInvitation?.firstName,
          [
            GovukValidators.required("Enter user's first name"),
            GovukValidators.maxLength(255, 'First name should not be more than 255 characters'),
          ],
        ),
        lastName: new FormControl<AdminVerifierUserInvitationDTO['lastName']>(
          state?.adminVerifierUserInvitation?.lastName,
          [
            GovukValidators.required("Enter user's last name"),
            GovukValidators.maxLength(255, 'Last name should not be more than 255 characters'),
          ],
        ),
        email: new FormControl<AdminVerifierUserInvitationDTO['email']>(state?.adminVerifierUserInvitation?.email, [
          GovukValidators.required(`Enter user's email address`),
          GovukValidators.email('Enter an email address in the correct format, like name@example.com'),
          GovukValidators.maxLength(255, 'Email should not be more than 255 characters'),
        ]),
        phoneNumber: new FormControl<AdminVerifierUserInvitationDTO['phoneNumber']>(
          state?.adminVerifierUserInvitation?.phoneNumber,
          [
            GovukValidators.empty('Enter phone number'),
            ...phoneInputValidators,
            GovukValidators.maxLength(255, 'Phone number should not be more than 255 characters'),
          ],
        ),
        mobileNumber: new FormControl<AdminVerifierUserInvitationDTO['mobileNumber']>(
          state?.adminVerifierUserInvitation?.mobileNumber,
          [
            ...phoneInputValidators,
            GovukValidators.maxLength(255, 'Mobile number should not be more than 255 characters'),
          ],
        ),
      }),
    });
  },
};
