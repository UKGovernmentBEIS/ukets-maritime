import { isNil } from 'lodash-es';

import { AerSmf } from '@mrtm/api';

export const AER_REDUCTION_CLAIM_SUB_TASK = 'smf';

export enum ReductionClaimWizardStep {
  SUMMARY = '../',
  EXIST = 'exist',
  DETAILS = 'details',
  FUEL_PURCHASE = 'fuel-purchase',
  DELETE_FUEL_PURCHASE = 'delete-fuel-purchase',
}

export const aerSmfDetailsCompleted = (data: AerSmf): boolean =>
  (!isNil(data?.exist) && !data?.exist) || (data?.exist && !isNil(data?.smfDetails.purchases?.length));

export const aerReductionClaimStepsCompleted: Record<keyof AerSmf, (data: AerSmf) => boolean> = {
  exist: (data: AerSmf) => !isNil(data?.exist),
  smfDetails: aerSmfDetailsCompleted,
};

export const isWizardCompleted = (reductionClaim: AerSmf): boolean => {
  for (const key of Object.keys(aerReductionClaimStepsCompleted)) {
    if (!aerReductionClaimStepsCompleted[key](reductionClaim)) {
      return false;
    }
  }

  return true;
};
