import { AerVerifierDetails } from '@requests/common/aer/aer.types';

export const isWizardCompleted = (verifierDetails: AerVerifierDetails): boolean => {
  return (
    !!verifierDetails?.verifierContact?.name &&
    !!verifierDetails?.verifierContact?.email &&
    !!verifierDetails?.verifierContact?.phoneNumber &&
    !!verifierDetails?.verificationTeamDetails?.leadEtsAuditor &&
    !!verifierDetails?.verificationTeamDetails?.etsAuditors &&
    !!verifierDetails?.verificationTeamDetails?.etsTechnicalExperts &&
    !!verifierDetails?.verificationTeamDetails?.independentReviewer &&
    !!verifierDetails?.verificationTeamDetails?.technicalExperts &&
    !!verifierDetails?.verificationTeamDetails?.authorisedSignatoryName
  );
};
