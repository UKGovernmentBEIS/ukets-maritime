import { Observable, of } from 'rxjs';

import { WizardFlowManager } from '@netz/common/forms';

import { COMPLIANCE_MONITORING_REPORTING_SUB_TASK, ComplianceMonitoringReportingStep } from '@requests/common/aer';

export class ComplianceMonitoringReportingFlowManager extends WizardFlowManager {
  readonly subtask = COMPLIANCE_MONITORING_REPORTING_SUB_TASK;

  nextStepPath(currentStep: string): Observable<string> {
    switch (currentStep) {
      case ComplianceMonitoringReportingStep.ACCURACY:
        return of(`../${ComplianceMonitoringReportingStep.COMPLETENESS}`);

      case ComplianceMonitoringReportingStep.COMPLETENESS:
        return of(`../${ComplianceMonitoringReportingStep.CONSISTENCY_COMPARABILITY_TRANSPARENCY}`);

      case ComplianceMonitoringReportingStep.CONSISTENCY_COMPARABILITY_TRANSPARENCY:
        return of(`../${ComplianceMonitoringReportingStep.INTEGRITY}`);

      case ComplianceMonitoringReportingStep.INTEGRITY:
        return of(ComplianceMonitoringReportingStep.SUMMARY);

      default:
        return of('../../');
    }
  }
}
