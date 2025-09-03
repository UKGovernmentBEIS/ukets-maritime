import { InjectionToken } from '@angular/core';

import { EmpMandate, EmpRegisteredOwner } from '@mrtm/api';

export const MANDATE_SUB_TASK = 'mandate';
export const MANDATE_REGISTERED_OWNER_PARAM = 'registeredOwnerId';

export enum MandateWizardStep {
  RESPONSIBILITY = 'responsibility',
  RESPONSIBILITY_DECLARATION = 'responsibility-declaration',
  REGISTERED_OWNERS = 'registered-owners',
  REGISTERED_OWNERS_FORM_ADD = 'add',
  REGISTERED_OWNERS_FORM_EDIT = 'edit',
  DELETE_REGISTERED_OWNER = 'delete-registered-owner',
  DECISION = 'decision',
  SUMMARY = '../',
}

export const MANDATE_REGISTERED_OWNER_FORM_MODE: InjectionToken<
  MandateWizardStep.REGISTERED_OWNERS_FORM_ADD | MandateWizardStep.REGISTERED_OWNERS_FORM_EDIT
> = new InjectionToken<MandateWizardStep.REGISTERED_OWNERS_FORM_ADD | MandateWizardStep.REGISTERED_OWNERS_FORM_EDIT>(
  'Mandate registered owner form mode',
);

export const isWizardCompleted = (
  mandate: Omit<EmpMandate, 'registeredOwners'> & {
    registeredOwners: Array<EmpRegisteredOwner & { needsReview: boolean }>;
  },
): boolean => {
  return (
    mandate?.exist === false ||
    (mandate.exist &&
      mandate?.registeredOwners?.length > 0 &&
      mandate?.registeredOwners?.every((ro) => !ro.needsReview) &&
      mandate?.responsibilityDeclaration)
  );
};
