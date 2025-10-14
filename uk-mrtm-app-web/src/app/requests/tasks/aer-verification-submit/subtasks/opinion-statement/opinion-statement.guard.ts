import { inject } from '@angular/core';
import { CanActivateFn, createUrlTreeFromSnapshot } from '@angular/router';

import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';

import { OpinionStatementStep } from '@requests/common/aer/subtasks/opinion-statement/opinion-statement.helpers';
import { aerVerificationSubmitQuery } from '@requests/tasks/aer-verification-submit/+state/aer-verification-submit.selectors';
import { isWizardCompleted } from '@requests/tasks/aer-verification-submit/subtasks/opinion-statement/opinion-statement.wizard';

export const canActivateOpinionStatementSummary: CanActivateFn = (route) => {
  const store = inject(RequestTaskStore);
  const payload = store.select(aerVerificationSubmitQuery.selectPayload)();
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();

  return (
    !isEditable ||
    (isEditable && isWizardCompleted(payload)) ||
    createUrlTreeFromSnapshot(route, [`./${OpinionStatementStep.EMISSIONS_FORM}`])
  );
};

export const canActivateOpinionStatementStep: CanActivateFn = (route) => {
  const isChange = route.queryParamMap.get('change') === 'true';
  const store = inject(RequestTaskStore);
  const payload = store.select(aerVerificationSubmitQuery.selectPayload)();
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();

  return ((!isWizardCompleted(payload) || isChange) && isEditable) || createUrlTreeFromSnapshot(route, ['../']);
};
