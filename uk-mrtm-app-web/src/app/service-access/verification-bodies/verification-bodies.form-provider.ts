import { InjectionToken, Provider } from '@angular/core';
import { FormArray, FormBuilder, FormControl } from '@angular/forms';

import { VerificationBodyDTO, VerificationBodyUpdateStatusDTO } from '@mrtm/api';

import { VerificationBodiesStoreService } from '@service-access/verification-bodies/+state/verification-bodies-store.service';

export const VERIFICATION_BODIES_FORM: InjectionToken<string> = new InjectionToken('Verification bodies form');

export function buildVerificationBodiesFormArray(
  formBuilder: FormBuilder,
  items: Pick<VerificationBodyDTO, 'id' | 'status'>[],
): FormArray {
  return formBuilder.array(
    items.map(({ id, status }) =>
      formBuilder.group({
        id: new FormControl<VerificationBodyUpdateStatusDTO['id']>(id),
        status: new FormControl<VerificationBodyUpdateStatusDTO['status']>(status),
      }),
    ),
  );
}

// The component is rendered inside a lazy tab, so the store may not hold the
// list yet when this factory runs; the form array is rebuilt on every store
// emission by the component.
export const createVerificationBodiesFormProvider: Provider = {
  provide: VERIFICATION_BODIES_FORM,
  deps: [FormBuilder, VerificationBodiesStoreService],
  useFactory: (formBuilder: FormBuilder, store: VerificationBodiesStoreService) =>
    formBuilder.group({
      verificationBodies: buildVerificationBodiesFormArray(
        formBuilder,
        store.getState().verificationBodiesList?.items ?? [],
      ),
    }),
};
