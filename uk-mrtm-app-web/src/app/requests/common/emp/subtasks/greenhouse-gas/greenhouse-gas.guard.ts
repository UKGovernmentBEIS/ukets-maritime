import { inject } from '@angular/core';
import { CanActivateFn, createUrlTreeFromSnapshot } from '@angular/router';

import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';

import { empCommonQuery } from '@requests/common/emp/+state';
import { GreenhouseGasWizardStep } from '@requests/common/emp/subtasks/greenhouse-gas/greenhouse-gas.helper';
import { isGreenhouseGasCompleted } from '@requests/common/emp/subtasks/greenhouse-gas/greenhouse-gas.wizard';

export const canActivateGreenhouseGasStep =
  (fallbackStep: GreenhouseGasWizardStep = GreenhouseGasWizardStep.SUMMARY): CanActivateFn =>
  (route) => {
    const store = inject(RequestTaskStore);
    const change = route.queryParamMap.get('change') === 'true';

    const greenhouseGas = store.select(empCommonQuery.selectGreenhouseGas)();
    const isEditable = store.select(requestTaskQuery.selectIsEditable)();

    if (!isEditable) return createUrlTreeFromSnapshot(route, [GreenhouseGasWizardStep.SUMMARY]);

    const fallbackRedirect = fallbackStep === GreenhouseGasWizardStep.SUMMARY ? [fallbackStep] : ['../', fallbackStep];

    return !isGreenhouseGasCompleted(greenhouseGas) || change || createUrlTreeFromSnapshot(route, fallbackRedirect);
  };

export const canActivateGreenhouseGasDecision: CanActivateFn = (route) => {
  const store = inject(RequestTaskStore);
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();

  if (!isEditable) return createUrlTreeFromSnapshot(route, [GreenhouseGasWizardStep.SUMMARY]);

  return true;
};

export const canActivateGreenhouseGasSummary: CanActivateFn = (route) => {
  const store = inject(RequestTaskStore);
  const empMonitoringGreenhouseGas = store.select(empCommonQuery.selectGreenhouseGas)();
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();

  return (
    !isEditable ||
    (isEditable && isGreenhouseGasCompleted(empMonitoringGreenhouseGas)) ||
    createUrlTreeFromSnapshot(route, ['./', GreenhouseGasWizardStep.FUEL])
  );
};
