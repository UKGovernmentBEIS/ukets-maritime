import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { AerComplianceMonitoringReporting, AerVerificationReport } from '@mrtm/api';

import { PayloadMutator } from '@netz/common/forms';

import { COMPLIANCE_MONITORING_REPORTING_SUB_TASK, ComplianceMonitoringReportingStep } from '@requests/common/aer';
import { AerVerificationSubmitTaskPayload } from '@requests/common/aer/aer.types';

export class ComplianceMonitoringReportingCompletenessPayloadMutator extends PayloadMutator {
  readonly subtask = COMPLIANCE_MONITORING_REPORTING_SUB_TASK;
  readonly step = ComplianceMonitoringReportingStep.COMPLETENESS;

  apply(
    currentPayload: AerVerificationSubmitTaskPayload,
    userInput: {
      completenessCompliant: AerComplianceMonitoringReporting['completenessCompliant'];
      completenessNonCompliantReason: AerComplianceMonitoringReporting['completenessNonCompliantReason'];
    },
  ): Observable<AerVerificationSubmitTaskPayload> {
    return of(
      produce(currentPayload, (payload) => {
        if (!payload.verificationReport) {
          payload.verificationReport = {} as AerVerificationReport;
        }
        payload.verificationReport.complianceMonitoringReporting.completenessCompliant =
          userInput.completenessCompliant;
        payload.verificationReport.complianceMonitoringReporting.completenessNonCompliantReason =
          userInput.completenessNonCompliantReason;
      }),
    );
  }
}
