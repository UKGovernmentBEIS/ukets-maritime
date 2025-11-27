import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, createUrlTreeFromSnapshot } from '@angular/router';

import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';

import { EmissionsReductionClaimsVerificationStep } from '@requests/common/aer/subtasks/emissions-reduction-claim-verification';
import { aerVerificationSubmitQuery } from '@requests/tasks/aer-verification-submit/+state/aer-verification-submit.selectors';
import { isWizardCompleted } from '@requests/tasks/aer-verification-submit/subtasks/emissions-reduction-claims-verification/emissions-reduction-claims-verification.wizard';

export const canActivateEmissionsReductionClaimVerificationSummary: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const store = inject(RequestTaskStore);
  const emissionsReductionClamVerification = store.select(
    aerVerificationSubmitQuery.selectEmissionsReductionClaimVerification,
  )();
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();

  return (
    !isEditable ||
    (isEditable && isWizardCompleted(emissionsReductionClamVerification)) ||
    createUrlTreeFromSnapshot(route, [`./${EmissionsReductionClaimsVerificationStep.FORM}`])
  );
};

export const canActivateEmissionsReductionClaimVerificationStep: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const isChange = route.queryParamMap.get('change') === 'true';
  const store = inject(RequestTaskStore);
  const emissionsReductionClamVerification = store.select(
    aerVerificationSubmitQuery.selectEmissionsReductionClaimVerification,
  )();
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();

  return (
    ((!isWizardCompleted(emissionsReductionClamVerification) || isChange) && isEditable) ||
    createUrlTreeFromSnapshot(route, ['../'])
  );
};
