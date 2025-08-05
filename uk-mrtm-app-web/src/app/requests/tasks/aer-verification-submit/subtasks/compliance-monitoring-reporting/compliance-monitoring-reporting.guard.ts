import { inject } from '@angular/core';
import { CanActivateFn, createUrlTreeFromSnapshot } from '@angular/router';

import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';

import { aerVerificationSubmitQuery } from '@requests/tasks/aer-verification-submit/+state/aer-verification-submit.selectors';
import {
  getNextIncompleteStep,
  isWizardCompleted,
} from '@requests/tasks/aer-verification-submit/subtasks/compliance-monitoring-reporting/compliance-monitoring-reporting.wizard';

export const canActivateComplianceMonitoringReportingSummary: CanActivateFn = (route) => {
  const store = inject(RequestTaskStore);
  const payload = store.select(aerVerificationSubmitQuery.selectPayload)();
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();
  const complianceMonitoringReporting = store.select(aerVerificationSubmitQuery.selectComplianceMonitoringReporting)();

  return (
    !isEditable ||
    (isEditable && isWizardCompleted(payload)) ||
    createUrlTreeFromSnapshot(route, [`./${getNextIncompleteStep(complianceMonitoringReporting)}`])
  );
};

export const canActivateComplianceMonitoringReportingStep: CanActivateFn = (route) => {
  const isChange = route.queryParamMap.get('change') === 'true';
  const store = inject(RequestTaskStore);
  const payload = store.select(aerVerificationSubmitQuery.selectPayload)();
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();

  return ((!isWizardCompleted(payload) || isChange) && isEditable) || createUrlTreeFromSnapshot(route, ['../']);
};
