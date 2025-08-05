import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { AerComplianceMonitoringReporting, AerVerificationReport } from '@mrtm/api';

import { PayloadMutator } from '@netz/common/forms';

import { COMPLIANCE_MONITORING_REPORTING_SUB_TASK, ComplianceMonitoringReportingStep } from '@requests/common/aer';
import { AerVerificationSubmitTaskPayload } from '@requests/common/aer/aer.types';

export class ComplianceMonitoringReportingAccuracyPayloadMutator extends PayloadMutator {
  readonly subtask = COMPLIANCE_MONITORING_REPORTING_SUB_TASK;
  readonly step = ComplianceMonitoringReportingStep.ACCURACY;

  apply(
    currentPayload: AerVerificationSubmitTaskPayload,
    userInput: {
      accuracyCompliant: AerComplianceMonitoringReporting['accuracyCompliant'];
      accuracyNonCompliantReason: AerComplianceMonitoringReporting['accuracyNonCompliantReason'];
    },
  ): Observable<AerVerificationSubmitTaskPayload> {
    return of(
      produce(currentPayload, (payload) => {
        if (!payload.verificationReport) {
          payload.verificationReport = {} as AerVerificationReport;
        }
        if (!payload.verificationReport.complianceMonitoringReporting) {
          payload.verificationReport.complianceMonitoringReporting = {} as AerComplianceMonitoringReporting;
        }
        payload.verificationReport.complianceMonitoringReporting.accuracyCompliant = userInput.accuracyCompliant;
        payload.verificationReport.complianceMonitoringReporting.accuracyNonCompliantReason =
          userInput.accuracyNonCompliantReason;
      }),
    );
  }
}
