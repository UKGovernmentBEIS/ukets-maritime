import { InjectionToken, Provider } from '@angular/core';
import { FormBuilder, FormControl, UntypedFormGroup } from '@angular/forms';

import { UserAuthorityInfoDTO, VerifierAuthorityUpdateDTO } from '@mrtm/api';

export const VERIFIER_USERS_LIST_FORM: InjectionToken<string> = new InjectionToken('Verifier users form');

export const verifierUsersListFormProvider: Provider = {
  provide: VERIFIER_USERS_LIST_FORM,
  deps: [FormBuilder],
  useFactory:
    (formBuilder: FormBuilder) =>
    (authorities: UserAuthorityInfoDTO[] = []): UntypedFormGroup => {
      return formBuilder.group({
        verifierUsers: formBuilder.array(
          (authorities ?? []).map(({ userId, authorityStatus, roleCode }) =>
            formBuilder.group({
              userId: new FormControl<VerifierAuthorityUpdateDTO['userId']>(userId),
              authorityStatus: new FormControl<VerifierAuthorityUpdateDTO['authorityStatus']>(authorityStatus),
              roleCode: new FormControl<VerifierAuthorityUpdateDTO['roleCode']>(roleCode),
            }),
          ),
        ),
      });
    },
};
