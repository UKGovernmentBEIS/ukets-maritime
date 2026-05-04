import { EmpBatchReissueRequestCreateActionPayload } from '@mrtm/api';

import { isNil } from '@shared/utils';

export const isSummaryCompleted = (batchVariation?: EmpBatchReissueRequestCreateActionPayload): boolean =>
  !isNil(batchVariation?.summary);

export const isSignatoryCompleted = (batchVariation?: EmpBatchReissueRequestCreateActionPayload): boolean =>
  !isNil(batchVariation?.signatory);

export const isBatchVariationCompleted = (batchVariation?: EmpBatchReissueRequestCreateActionPayload): boolean =>
  isSummaryCompleted(batchVariation) && isSignatoryCompleted(batchVariation);

export enum SubmitWizardSteps {
  EMP_LOG = 'emp-log',
  SIGNATURE = 'signature',
  SUMMARY = '../',
}

export const WIZARD_STEP_CHECK_MAP: Record<
  SubmitWizardSteps,
  (batchVariation?: EmpBatchReissueRequestCreateActionPayload) => boolean
> = {
  [SubmitWizardSteps.EMP_LOG]: () => true,
  [SubmitWizardSteps.SIGNATURE]: isSummaryCompleted,
  [SubmitWizardSteps.SUMMARY]: isBatchVariationCompleted,
};
