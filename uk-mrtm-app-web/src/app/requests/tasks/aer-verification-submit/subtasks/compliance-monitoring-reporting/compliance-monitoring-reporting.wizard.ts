import { AerComplianceMonitoringReporting } from '@mrtm/api';

import { ComplianceMonitoringReportingStep } from '@requests/common/aer';
import { AerVerificationSubmitTaskPayload } from '@requests/common/aer/aer.types';

export const isWizardCompleted = (payload: AerVerificationSubmitTaskPayload): boolean => {
  const complianceMonitoringReporting = payload.verificationReport?.complianceMonitoringReporting;
  return (
    isAccuracyStepCompleted(complianceMonitoringReporting) &&
    isCompletenessStepCompleted(complianceMonitoringReporting) &&
    isCctStepCompleted(complianceMonitoringReporting) &&
    isIntegrityStepCompleted(complianceMonitoringReporting)
  );
};

export const getNextIncompleteStep = (
  complianceMonitoringReporting: AerComplianceMonitoringReporting,
): ComplianceMonitoringReportingStep => {
  if (!isAccuracyStepCompleted(complianceMonitoringReporting)) {
    return ComplianceMonitoringReportingStep.ACCURACY;
  } else if (!isCompletenessStepCompleted(complianceMonitoringReporting)) {
    return ComplianceMonitoringReportingStep.COMPLETENESS;
  } else if (!isCctStepCompleted(complianceMonitoringReporting)) {
    return ComplianceMonitoringReportingStep.CONSISTENCY_COMPARABILITY_TRANSPARENCY;
  } else if (!isIntegrityStepCompleted(complianceMonitoringReporting)) {
    return ComplianceMonitoringReportingStep.INTEGRITY;
  }
  return ComplianceMonitoringReportingStep.ACCURACY;
};

const isAccuracyStepCompleted = (complianceMonitoringReporting: AerComplianceMonitoringReporting): boolean => {
  return (
    complianceMonitoringReporting?.accuracyCompliant === true ||
    (complianceMonitoringReporting?.accuracyCompliant === false &&
      !!complianceMonitoringReporting?.accuracyNonCompliantReason)
  );
};

const isCompletenessStepCompleted = (complianceMonitoringReporting: AerComplianceMonitoringReporting): boolean => {
  return (
    complianceMonitoringReporting?.completenessCompliant === true ||
    (complianceMonitoringReporting?.completenessCompliant === false &&
      !!complianceMonitoringReporting?.completenessNonCompliantReason)
  );
};

const isCctStepCompleted = (complianceMonitoringReporting: AerComplianceMonitoringReporting): boolean => {
  const isConsistencyCompleted =
    complianceMonitoringReporting?.consistencyCompliant === true ||
    (complianceMonitoringReporting?.consistencyCompliant === false &&
      !!complianceMonitoringReporting?.consistencyNonCompliantReason);

  const isComparabilityCompleted =
    complianceMonitoringReporting?.comparabilityCompliant === true ||
    (complianceMonitoringReporting?.comparabilityCompliant === false &&
      !!complianceMonitoringReporting?.comparabilityNonCompliantReason);

  const isTransparencyCompleted =
    complianceMonitoringReporting?.transparencyCompliant === true ||
    (complianceMonitoringReporting?.transparencyCompliant === false &&
      !!complianceMonitoringReporting?.transparencyNonCompliantReason);

  return isConsistencyCompleted && isComparabilityCompleted && isTransparencyCompleted;
};

const isIntegrityStepCompleted = (complianceMonitoringReporting: AerComplianceMonitoringReporting): boolean => {
  return (
    complianceMonitoringReporting?.integrityCompliant === true ||
    (complianceMonitoringReporting?.integrityCompliant === false &&
      !!complianceMonitoringReporting?.integrityNonCompliantReason)
  );
};
