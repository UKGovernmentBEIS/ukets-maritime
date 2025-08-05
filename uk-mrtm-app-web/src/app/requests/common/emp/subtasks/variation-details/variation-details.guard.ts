import { inject } from '@angular/core';
import { CanActivateFn, createUrlTreeFromSnapshot } from '@angular/router';

import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';

import { OperatorDetailsWizardStep } from '@requests/common/components/operator-details';
import { empVariationQuery, empVariationRegulatorQuery } from '@requests/common/emp/+state';
import { VariationDetailsWizardStep } from '@requests/common/emp/subtasks/variation-details/variation-details.helper';
import {
  isVariationDetailsWizardCompleted,
  isVariationRegulatorDetailsWizardCompleted,
} from '@requests/common/emp/subtasks/variation-details/variation-details.wizard';

export const canActivateVariationDetailsStep =
  (fallbackStep: VariationDetailsWizardStep = VariationDetailsWizardStep.SUMMARY): CanActivateFn =>
  (route) => {
    const store = inject(RequestTaskStore);
    const change = route.queryParamMap.get('change') === 'true';
    const isEditable = store.select(requestTaskQuery.selectIsEditable)();
    const details = store.select(empVariationQuery.selectEmpVariationDetails)();

    if (!isEditable) createUrlTreeFromSnapshot(route, [VariationDetailsWizardStep.SUMMARY]);

    const fallbackRedirect =
      fallbackStep === VariationDetailsWizardStep.SUMMARY ? [fallbackStep] : ['../', fallbackStep];

    return !isVariationDetailsWizardCompleted(details) || change || createUrlTreeFromSnapshot(route, fallbackRedirect);
  };

export const canActivateVariationDetailsDecision: CanActivateFn = (route) => {
  const store = inject(RequestTaskStore);
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();

  if (!isEditable) return createUrlTreeFromSnapshot(route, [OperatorDetailsWizardStep.SUMMARY]);

  return true;
};

export const canActivateVariationDetailsSummary: CanActivateFn = (route) => {
  const store = inject(RequestTaskStore);
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();
  const details = store.select(empVariationQuery.selectEmpVariationDetails)();

  return (
    !isEditable ||
    (isEditable && isVariationDetailsWizardCompleted(details)) ||
    createUrlTreeFromSnapshot(route, ['./', VariationDetailsWizardStep.DESCRIBE_CHANGES])
  );
};

export const canActivateRegulatorVariationDetailsStep =
  (fallbackStep: VariationDetailsWizardStep = VariationDetailsWizardStep.SUMMARY): CanActivateFn =>
  (route) => {
    const store = inject(RequestTaskStore);
    const change = route.queryParamMap.get('change') === 'true';
    const isEditable = store.select(requestTaskQuery.selectIsEditable)();
    const details = store.select(empVariationQuery.selectEmpVariationDetails)();
    const reasonRegulatorLed = store.select(empVariationRegulatorQuery.selectReasonRegulatorLed)();

    if (!isEditable) createUrlTreeFromSnapshot(route, [VariationDetailsWizardStep.SUMMARY]);

    const fallbackRedirect =
      fallbackStep === VariationDetailsWizardStep.SUMMARY ? [fallbackStep] : ['../', fallbackStep];

    return (
      !isVariationRegulatorDetailsWizardCompleted(details, reasonRegulatorLed) ||
      change ||
      createUrlTreeFromSnapshot(route, fallbackRedirect)
    );
  };

export const canActivateRegulatorVariationDetailsSummary: CanActivateFn = (route) => {
  const store = inject(RequestTaskStore);
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();
  const details = store.select(empVariationRegulatorQuery.selectEmpVariationDetails)();
  const reasonRegulatorLed = store.select(empVariationRegulatorQuery.selectReasonRegulatorLed)();

  return (
    !isEditable ||
    (isEditable && isVariationRegulatorDetailsWizardCompleted(details, reasonRegulatorLed)) ||
    createUrlTreeFromSnapshot(route, ['./', VariationDetailsWizardStep.DESCRIBE_CHANGES])
  );
};
