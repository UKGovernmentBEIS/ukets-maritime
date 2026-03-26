import { AerEtsComplianceRules } from '@mrtm/api';

import { AerVerificationSubmitTaskPayload } from '@requests/common/aer/aer.types';
import { isNil } from '@shared/utils';

export const isWizardCompleted = (payload: AerVerificationSubmitTaskPayload): boolean => {
  const etsComplianceRules = payload.verificationReport?.etsComplianceRules;
  return (
    isMonitoringPlanRequirementsMetCompleted(etsComplianceRules) &&
    isEtsOrderRequirementsMetCompleted(etsComplianceRules) &&
    isDetailSourceDataVerifiedCompleted(etsComplianceRules) &&
    isControlActivitiesDocumentedCompleted(etsComplianceRules) &&
    isProceduresMonitoringPlanDocumentedCompleted(etsComplianceRules) &&
    isDataVerificationCompletedCompleted(etsComplianceRules) &&
    isMonitoringApproachAppliedCorrectlyCompleted(etsComplianceRules) &&
    isMethodsApplyingMissingDataUsedCompleted(etsComplianceRules) &&
    isCompetentAuthorityGuidanceMetCompleted(etsComplianceRules) &&
    isNonConformitiesCompleted(etsComplianceRules)
  );
};

const isMonitoringPlanRequirementsMetCompleted = (etsComplianceRules: AerEtsComplianceRules): boolean => {
  return (
    etsComplianceRules?.monitoringPlanRequirementsMet === true ||
    (etsComplianceRules?.monitoringPlanRequirementsMet === false &&
      !isNil(etsComplianceRules?.monitoringPlanRequirementsNotMetReason))
  );
};

const isEtsOrderRequirementsMetCompleted = (etsComplianceRules: AerEtsComplianceRules): boolean => {
  return (
    etsComplianceRules?.etsOrderRequirementsMet === true ||
    (etsComplianceRules?.etsOrderRequirementsMet === false &&
      !isNil(etsComplianceRules?.etsOrderRequirementsNotMetReason))
  );
};

const isDetailSourceDataVerifiedCompleted = (etsComplianceRules: AerEtsComplianceRules): boolean => {
  return (
    (etsComplianceRules?.detailSourceDataVerified === true && !isNil(etsComplianceRules?.partOfSiteVerification)) ||
    (etsComplianceRules?.detailSourceDataVerified === false &&
      !isNil(etsComplianceRules?.detailSourceDataNotVerifiedReason))
  );
};

const isControlActivitiesDocumentedCompleted = (etsComplianceRules: AerEtsComplianceRules): boolean => {
  return (
    etsComplianceRules?.controlActivitiesDocumented === true ||
    (etsComplianceRules?.controlActivitiesDocumented === false &&
      !isNil(etsComplianceRules?.controlActivitiesNotDocumentedReason))
  );
};

const isProceduresMonitoringPlanDocumentedCompleted = (etsComplianceRules: AerEtsComplianceRules): boolean => {
  return (
    etsComplianceRules?.proceduresMonitoringPlanDocumented === true ||
    (etsComplianceRules?.proceduresMonitoringPlanDocumented === false &&
      !isNil(etsComplianceRules?.proceduresMonitoringPlanNotDocumentedReason))
  );
};

const isDataVerificationCompletedCompleted = (etsComplianceRules: AerEtsComplianceRules): boolean => {
  return (
    etsComplianceRules?.dataVerificationCompleted === true ||
    (etsComplianceRules?.dataVerificationCompleted === false &&
      !isNil(etsComplianceRules?.dataVerificationNotCompletedReason))
  );
};

const isMonitoringApproachAppliedCorrectlyCompleted = (etsComplianceRules: AerEtsComplianceRules): boolean => {
  return (
    etsComplianceRules?.monitoringApproachAppliedCorrectly === true ||
    (etsComplianceRules?.monitoringApproachAppliedCorrectly === false &&
      !isNil(etsComplianceRules?.monitoringApproachNotAppliedCorrectlyReason))
  );
};

const isMethodsApplyingMissingDataUsedCompleted = (etsComplianceRules: AerEtsComplianceRules): boolean => {
  return (
    etsComplianceRules?.methodsApplyingMissingDataUsed === true ||
    (etsComplianceRules?.methodsApplyingMissingDataUsed === false &&
      !isNil(etsComplianceRules?.methodsApplyingMissingDataNotUsedReason))
  );
};

const isCompetentAuthorityGuidanceMetCompleted = (etsComplianceRules: AerEtsComplianceRules): boolean => {
  return (
    etsComplianceRules?.competentAuthorityGuidanceMet === true ||
    (etsComplianceRules?.competentAuthorityGuidanceMet === false &&
      !isNil(etsComplianceRules?.competentAuthorityGuidanceNotMetReason))
  );
};

const isNonConformitiesCompleted = (etsComplianceRules: AerEtsComplianceRules): boolean => {
  return (
    etsComplianceRules?.nonConformities === 'YES' ||
    etsComplianceRules?.nonConformities === 'NOT_APPLICABLE' ||
    (etsComplianceRules?.nonConformities === 'NO' && !isNil(etsComplianceRules?.nonConformitiesDetails))
  );
};
