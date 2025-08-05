import { InjectionToken, Provider } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';

import { VerificationBodyUpdateStatusDTO } from '@mrtm/api';

import { VerificationBodiesStoreService } from '@verification-bodies/+state/verification-bodies-store.service';

export const VERIFICATION_BODIES_FORM: InjectionToken<string> = new InjectionToken('Verification bodies form');

export const createVerificationBodiesFormProvider: Provider = {
  provide: VERIFICATION_BODIES_FORM,
  deps: [FormBuilder, VerificationBodiesStoreService],
  useFactory: (formBuilder: FormBuilder, store: VerificationBodiesStoreService) => {
    const { items } = store.getState().verificationBodiesList;
    return formBuilder.group({
      verificationBodies: formBuilder.array(
        items.map(({ id, status }) =>
          formBuilder.group({
            id: new FormControl<VerificationBodyUpdateStatusDTO['id']>(id),
            status: new FormControl<VerificationBodyUpdateStatusDTO['status']>(status),
          }),
        ),
      ),
    });
  },
};
