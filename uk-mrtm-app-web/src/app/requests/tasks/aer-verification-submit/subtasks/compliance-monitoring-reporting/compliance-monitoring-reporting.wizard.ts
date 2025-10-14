import { AerComplianceMonitoringReporting } from '@mrtm/api';

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
