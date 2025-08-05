import { inject } from '@angular/core';
import { CanActivateFn, createUrlTreeFromSnapshot } from '@angular/router';

import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';

import { aerCommonQuery } from '@requests/common/aer/+state';
import {
  isWizardCompleted,
  ReportingObligationWizardStep,
} from '@requests/common/aer/subtasks/reporting-obligation/reporting-obligation.helpers';

export const canActivateReportingObligationSummary: CanActivateFn = (route) => {
  const store = inject(RequestTaskStore);
  const payload = store.select(aerCommonQuery.selectPayload)();
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();

  return (
    !isEditable ||
    (isEditable && isWizardCompleted(payload)) ||
    createUrlTreeFromSnapshot(route, ['./', ReportingObligationWizardStep.FORM])
  );
};

export const canActivateReportingObligationDetailsForm: CanActivateFn = (route) => {
  const isChange = route.queryParamMap.get('change') === 'true';
  const store = inject(RequestTaskStore);
  const payload = store.select(aerCommonQuery.selectPayload)();
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();

  return ((!isWizardCompleted(payload) || isChange) && isEditable) || createUrlTreeFromSnapshot(route, ['../']);
};
