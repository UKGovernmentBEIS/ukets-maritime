import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { AerComplianceMonitoringReporting, AerVerificationReport } from '@mrtm/api';

import { PayloadMutator } from '@netz/common/forms';

import { COMPLIANCE_MONITORING_REPORTING_SUB_TASK, ComplianceMonitoringReportingStep } from '@requests/common/aer';
import { AerVerificationSubmitTaskPayload } from '@requests/common/aer/aer.types';

export class ComplianceMonitoringReportingCctPayloadMutator extends PayloadMutator {
  readonly subtask = COMPLIANCE_MONITORING_REPORTING_SUB_TASK;
  readonly step = ComplianceMonitoringReportingStep.CONSISTENCY_COMPARABILITY_TRANSPARENCY;

  apply(
    currentPayload: AerVerificationSubmitTaskPayload,
    userInput: {
      consistencyCompliant: AerComplianceMonitoringReporting['consistencyCompliant'];
      consistencyNonCompliantReason: AerComplianceMonitoringReporting['consistencyNonCompliantReason'];
      comparabilityCompliant: AerComplianceMonitoringReporting['comparabilityCompliant'];
      comparabilityNonCompliantReason: AerComplianceMonitoringReporting['comparabilityNonCompliantReason'];
      transparencyCompliant: AerComplianceMonitoringReporting['transparencyCompliant'];
      transparencyNonCompliantReason: AerComplianceMonitoringReporting['transparencyNonCompliantReason'];
    },
  ): Observable<AerVerificationSubmitTaskPayload> {
    return of(
      produce(currentPayload, (payload) => {
        if (!payload.verificationReport) {
          payload.verificationReport = {} as AerVerificationReport;
        }
        payload.verificationReport.complianceMonitoringReporting.consistencyCompliant = userInput.consistencyCompliant;
        payload.verificationReport.complianceMonitoringReporting.consistencyNonCompliantReason =
          userInput.consistencyNonCompliantReason;

        payload.verificationReport.complianceMonitoringReporting.comparabilityCompliant =
          userInput.comparabilityCompliant;
        payload.verificationReport.complianceMonitoringReporting.comparabilityNonCompliantReason =
          userInput.comparabilityNonCompliantReason;

        payload.verificationReport.complianceMonitoringReporting.transparencyCompliant =
          userInput.transparencyCompliant;
        payload.verificationReport.complianceMonitoringReporting.transparencyNonCompliantReason =
          userInput.transparencyNonCompliantReason;
      }),
    );
  }
}
