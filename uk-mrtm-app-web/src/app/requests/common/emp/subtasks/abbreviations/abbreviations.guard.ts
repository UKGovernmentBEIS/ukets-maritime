import { inject } from '@angular/core';
import { CanActivateFn, createUrlTreeFromSnapshot } from '@angular/router';

import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';

import { empCommonQuery } from '@requests/common/emp/+state';
import { AbbreviationsWizardStep, isAbbreviationsCompleted } from '@requests/common/emp/subtasks/abbreviations';

export const canActivateAbbreviationsStep =
  (fallbackStep: AbbreviationsWizardStep = AbbreviationsWizardStep.SUMMARY): CanActivateFn =>
  (route) => {
    const store = inject(RequestTaskStore);
    const change = route.queryParamMap.get('change') === 'true';

    const abbreviations = store.select(empCommonQuery.selectAbbreviations)();
    const isEditable = store.select(requestTaskQuery.selectIsEditable)();

    if (!isEditable) return createUrlTreeFromSnapshot(route, [AbbreviationsWizardStep.SUMMARY]);

    const fallbackRedirect = fallbackStep === AbbreviationsWizardStep.SUMMARY ? [fallbackStep] : ['../', fallbackStep];

    return !isAbbreviationsCompleted(abbreviations) || change || createUrlTreeFromSnapshot(route, fallbackRedirect);
  };

export const canActivateAbbreviationsSummary: CanActivateFn = (route) => {
  const store = inject(RequestTaskStore);
  const abbreviations = store.select(empCommonQuery.selectAbbreviations)();
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();

  return (
    !isEditable ||
    (isEditable && isAbbreviationsCompleted(abbreviations)) ||
    createUrlTreeFromSnapshot(route, ['./', AbbreviationsWizardStep.ABBREVIATIONS_QUESTION])
  );
};

export const canActivateAbbreviationsDecision: CanActivateFn = (route) => {
  const store = inject(RequestTaskStore);
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();

  if (!isEditable) return createUrlTreeFromSnapshot(route, [AbbreviationsWizardStep.SUMMARY]);

  return true;
};
