import { Provider } from '@angular/core';

import { PAYLOAD_MUTATORS, SIDE_EFFECTS } from '@netz/common/forms';

import { MandateWizardStep } from '@requests/common/emp/subtasks/mandate/mandate.helper';
import { provideMandateRegisteredOwnersFormPayloadMutator } from '@requests/common/emp/subtasks/mandate/mandate-registered-owners-form/mandate-registered-owners-form.payload-mutator';
import { MandateResponsibilityPayloadMutator } from '@requests/common/emp/subtasks/mandate/mandate-responsibility/mandate-responsibility.payload-mutator';
import { MandateResponsibilityDeclarationPayloadMutator } from '@requests/common/emp/subtasks/mandate/mandate-responsibility-declaration';
import { MandateSummarySideEffect } from '@requests/common/emp/subtasks/mandate/mandate-summary';
import { DeleteRegisteredOwnerPayloadMutator } from '@requests/common/emp/subtasks/mandate/payload-mutators';
import { MandateSaveSideEffect } from '@requests/common/emp/subtasks/mandate/side-effects';

export const provideMandateSideEffects = (): Array<Provider> => [
  { provide: SIDE_EFFECTS, multi: true, useClass: MandateSaveSideEffect },
  { provide: SIDE_EFFECTS, multi: true, useClass: MandateSummarySideEffect },
];

export const provideMandatePayloadMutators = (): Array<Provider> => [
  { provide: PAYLOAD_MUTATORS, multi: true, useClass: MandateResponsibilityPayloadMutator },
  provideMandateRegisteredOwnersFormPayloadMutator(MandateWizardStep.REGISTERED_OWNERS_FORM_ADD),
  provideMandateRegisteredOwnersFormPayloadMutator(MandateWizardStep.REGISTERED_OWNERS_FORM_EDIT),
  { provide: PAYLOAD_MUTATORS, multi: true, useClass: DeleteRegisteredOwnerPayloadMutator },
  { provide: PAYLOAD_MUTATORS, multi: true, useClass: MandateResponsibilityDeclarationPayloadMutator },
];
