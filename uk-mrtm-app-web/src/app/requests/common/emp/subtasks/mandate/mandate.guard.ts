import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, createUrlTreeFromSnapshot, UrlTree } from '@angular/router';

import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';

import { empCommonQuery } from '@requests/common/emp/+state';
import { isWizardCompleted, MandateWizardStep } from '@requests/common/emp/subtasks/mandate/mandate.helper';

export const canActivateMandateSummary: CanActivateFn = (activatedRoute: ActivatedRouteSnapshot) => {
  const store = inject(RequestTaskStore);
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();
  const mandate = store.select(empCommonQuery.selectExtendedMandate)();
  const ismShips = store.select(empCommonQuery.selectIsmShipImoNumbers)();

  return (
    !isEditable ||
    (isEditable && isWizardCompleted(mandate, ismShips)) ||
    createUrlTreeFromSnapshot(activatedRoute, [MandateWizardStep.RESPONSIBILITY])
  );
};

export const canActivateMandateWizardStep: CanActivateFn = (
  activatedRoute: ActivatedRouteSnapshot,
): boolean | UrlTree => {
  const store = inject(RequestTaskStore);
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();

  return isEditable || createUrlTreeFromSnapshot(activatedRoute, [MandateWizardStep.SUMMARY]);
};

export const canActivateRegisteredOwners: CanActivateFn = (
  activatedRoute: ActivatedRouteSnapshot,
): boolean | UrlTree => {
  const store = inject(RequestTaskStore);
  const mandate = store.select(empCommonQuery.selectMandate)();

  return mandate.exist || createUrlTreeFromSnapshot(activatedRoute, ['../', MandateWizardStep.RESPONSIBILITY]);
};

export const canActivateMandateDecision: CanActivateFn = (route) => {
  const store = inject(RequestTaskStore);
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();

  if (!isEditable) return createUrlTreeFromSnapshot(route, [MandateWizardStep.SUMMARY]);

  return true;
};
