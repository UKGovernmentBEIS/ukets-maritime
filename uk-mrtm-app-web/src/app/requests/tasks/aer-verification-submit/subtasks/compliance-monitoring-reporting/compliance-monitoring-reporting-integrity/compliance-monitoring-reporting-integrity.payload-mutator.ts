import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { AerComplianceMonitoringReporting, AerVerificationReport } from '@mrtm/api';

import { PayloadMutator } from '@netz/common/forms';

import { COMPLIANCE_MONITORING_REPORTING_SUB_TASK, ComplianceMonitoringReportingStep } from '@requests/common/aer';
import { AerVerificationSubmitTaskPayload } from '@requests/common/aer/aer.types';

export class ComplianceMonitoringReportingIntegrityPayloadMutator extends PayloadMutator {
  readonly subtask = COMPLIANCE_MONITORING_REPORTING_SUB_TASK;
  readonly step = ComplianceMonitoringReportingStep.INTEGRITY;

  apply(
    currentPayload: AerVerificationSubmitTaskPayload,
    userInput: {
      integrityCompliant: AerComplianceMonitoringReporting['integrityCompliant'];
      integrityNonCompliantReason: AerComplianceMonitoringReporting['integrityNonCompliantReason'];
    },
  ): Observable<AerVerificationSubmitTaskPayload> {
    return of(
      produce(currentPayload, (payload) => {
        if (!payload.verificationReport) {
          payload.verificationReport = {} as AerVerificationReport;
        }
        payload.verificationReport.complianceMonitoringReporting.integrityCompliant = userInput.integrityCompliant;
        payload.verificationReport.complianceMonitoringReporting.integrityNonCompliantReason =
          userInput.integrityNonCompliantReason;
      }),
    );
  }
}
