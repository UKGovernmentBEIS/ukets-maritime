import { isNil } from 'lodash-es';

import { AerInPersonSiteVisit, AerOpinionStatement, AerVirtualSiteVisit } from '@mrtm/api';

import { AerVerificationSubmitTaskPayload } from '@requests/common/aer/aer.types';

export const isWizardCompleted = (payload: AerVerificationSubmitTaskPayload): boolean => {
  const opinionStatement = payload.verificationReport?.opinionStatement;
  return (
    isEmissionsFormStepCompleted(opinionStatement) &&
    isAdditionalChangesStepCompleted(opinionStatement) &&
    isSiteVisitStepCompleted(opinionStatement) &&
    isSiteVisitStepDetailsCompleted(opinionStatement)
  );
};

const isEmissionsFormStepCompleted = (opinionStatement: AerOpinionStatement): boolean => {
  return (
    opinionStatement?.emissionsCorrect === true ||
    (opinionStatement?.emissionsCorrect === false &&
      !isNil(opinionStatement?.manuallyProvidedTotalEmissions) &&
      !isNil(opinionStatement?.manuallyProvidedLess5PercentIceClassDeduction) &&
      !isNil(opinionStatement?.manuallyProvidedLessIslandFerryDeduction) &&
      !isNil(opinionStatement?.manuallyProvidedSurrenderEmissions))
  );
};

const isAdditionalChangesStepCompleted = (opinionStatement: AerOpinionStatement): boolean => {
  return (
    opinionStatement?.additionalChangesNotCovered === false ||
    (opinionStatement?.additionalChangesNotCovered === true && !!opinionStatement?.additionalChangesNotCoveredDetails)
  );
};

const isSiteVisitStepCompleted = (opinionStatement: AerOpinionStatement): boolean => {
  return opinionStatement?.siteVisit?.type === 'IN_PERSON' || opinionStatement?.siteVisit?.type === 'VIRTUAL';
};

const isSiteVisitStepDetailsCompleted = (opinionStatement: AerOpinionStatement): boolean => {
  if (opinionStatement?.siteVisit?.type === 'IN_PERSON') {
    return (
      !!(opinionStatement?.siteVisit as AerInPersonSiteVisit)?.teamMembers &&
      (opinionStatement?.siteVisit as AerInPersonSiteVisit)?.visitDates?.length > 0
    );
  }
  if (opinionStatement?.siteVisit?.type === 'VIRTUAL') {
    return !!(opinionStatement?.siteVisit as AerVirtualSiteVisit)?.reason;
  }
  return false;
};
