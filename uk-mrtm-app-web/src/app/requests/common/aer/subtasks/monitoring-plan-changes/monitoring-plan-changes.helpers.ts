import { AerSubmitTaskPayload } from '@requests/common/aer/aer.types';

export const MONITORING_PLAN_CHANGES_SUB_TASK = 'aerMonitoringPlanChanges';

export const MONITORING_PLAN_CHANGES_SUB_TASK_PATH = 'monitoring-plan-changes';

export enum MonitoringPlanChangesWizardStep {
  FORM = 'changes',
  SUMMARY = '../',
}

export const isWizardCompleted = (payload: AerSubmitTaskPayload): boolean => {
  const monitoringPlanChanges = payload.aer?.aerMonitoringPlanChanges;
  return (
    monitoringPlanChanges?.changesExist === false ||
    (monitoringPlanChanges?.changesExist === true && !!monitoringPlanChanges?.changes)
  );
};
