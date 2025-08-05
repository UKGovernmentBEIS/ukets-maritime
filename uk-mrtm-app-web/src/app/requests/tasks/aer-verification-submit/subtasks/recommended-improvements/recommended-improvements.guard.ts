import { inject } from '@angular/core';
import { CanActivateFn, createUrlTreeFromSnapshot } from '@angular/router';

import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';

import { RecommendedImprovementsStep } from '@requests/common/aer';
import { aerVerificationSubmitQuery } from '@requests/tasks/aer-verification-submit/+state/aer-verification-submit.selectors';
import { isWizardCompleted } from '@requests/tasks/aer-verification-submit/subtasks/recommended-improvements/recommended-improvements.wizard';

export const canActivateRecommendedImprovementsSummary: CanActivateFn = (route) => {
  const store = inject(RequestTaskStore);
  const recommendedImprovements = store.select(aerVerificationSubmitQuery.selectRecommendedImprovements)();
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();

  return (
    !isEditable ||
    (isEditable && isWizardCompleted(recommendedImprovements)) ||
    createUrlTreeFromSnapshot(route, [
      recommendedImprovements?.exist === true
        ? `./${RecommendedImprovementsStep.ITEMS_LIST}`
        : `./${RecommendedImprovementsStep.EXIST_FORM}`,
    ])
  );
};

export const canActivateRecommendedImprovementsExistFormStep: CanActivateFn = (route) => {
  const store = inject(RequestTaskStore);
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();

  return isEditable || createUrlTreeFromSnapshot(route, ['../']);
};

export const canActivateRecommendedImprovementsAddOrList: CanActivateFn = (route) => {
  const store = inject(RequestTaskStore);
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();
  const recommendedImprovementsExist = store.select(aerVerificationSubmitQuery.selectRecommendedImprovements)()?.exist;

  return (isEditable && recommendedImprovementsExist) || createUrlTreeFromSnapshot(route, ['../']);
};

export const canActivateRecommendedImprovementsEditOrRemove: CanActivateFn = (route) => {
  const store = inject(RequestTaskStore);
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();
  const improvements = store.select(aerVerificationSubmitQuery.selectRecommendedImprovements)()
    ?.recommendedImprovements;
  const referenceParam = route.paramMap.get('reference');
  const hasEntry =
    referenceParam && improvements?.length && !!improvements.find(({ reference }) => reference === referenceParam);

  return (isEditable && hasEntry) || createUrlTreeFromSnapshot(route, [`../${RecommendedImprovementsStep.SUMMARY}`]);
};
