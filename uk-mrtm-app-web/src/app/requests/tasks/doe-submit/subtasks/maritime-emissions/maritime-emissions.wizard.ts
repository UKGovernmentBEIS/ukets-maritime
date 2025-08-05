import { DoeMaritimeEmissions } from '@mrtm/api';

import BigNumber from 'bignumber.js';

export const isWizardCompleted = (maritimeEmissions: DoeMaritimeEmissions) => {
  const totalMaritimeEmissions = maritimeEmissions?.totalMaritimeEmissions;
  const feeDetails = maritimeEmissions?.feeDetails;

  const feeDetailsValid = !!feeDetails?.totalBillableHours && !!feeDetails?.hourlyRate && !!feeDetails?.dueDate;

  const isDeterminationReasonValid = !!maritimeEmissions?.determinationReason?.type;
  const isTotalMaritimeEmissionsValid =
    new BigNumber(totalMaritimeEmissions?.totalReportableEmissions).gte(0) &&
    new BigNumber(totalMaritimeEmissions?.surrenderEmissions).gte(0) &&
    !!totalMaritimeEmissions?.calculationApproach;
  const isChargeOperatorValid =
    maritimeEmissions?.chargeOperator === false || (maritimeEmissions?.chargeOperator === true && feeDetailsValid);

  return isDeterminationReasonValid && isTotalMaritimeEmissionsValid && isChargeOperatorValid;
};
