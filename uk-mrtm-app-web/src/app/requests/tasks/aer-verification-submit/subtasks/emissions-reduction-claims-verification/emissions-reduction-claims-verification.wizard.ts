import { AerEmissionsReductionClaimVerification } from '@mrtm/api';

import { isNil } from '@shared/utils';

export const isWizardCompleted = (
  emissionsReductionClaimVerification: AerEmissionsReductionClaimVerification,
): boolean => {
  return (
    (emissionsReductionClaimVerification?.smfBatchClaimsReviewed === true ||
      (emissionsReductionClaimVerification?.smfBatchClaimsReviewed === false &&
        !isNil(emissionsReductionClaimVerification?.batchReferencesNotReviewed) &&
        !isNil(emissionsReductionClaimVerification.dataSampling))) &&
    !isNil(emissionsReductionClaimVerification.reviewResults) &&
    !isNil(emissionsReductionClaimVerification.noDoubleCountingConfirmation) &&
    (emissionsReductionClaimVerification.evidenceAllCriteriaMetExist === true ||
      (emissionsReductionClaimVerification.evidenceAllCriteriaMetExist === false &&
        !isNil(emissionsReductionClaimVerification.noCriteriaMetIssues))) &&
    (emissionsReductionClaimVerification.complianceWithEmpRequirementsExist === true ||
      (emissionsReductionClaimVerification.complianceWithEmpRequirementsExist === false &&
        !isNil(emissionsReductionClaimVerification.notCompliedWithEmpRequirementsAspects)))
  );
};
