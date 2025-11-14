import { AerPortEmissionsMeasurement } from '@mrtm/api';

import { bigNumberUtils } from '@shared/utils';

export const calculateTotalEmissionsFromVoyagesAndPortsMeasurement = (
  ...inputData: Array<AerPortEmissionsMeasurement>
): AerPortEmissionsMeasurement => {
  const co2Items: Array<AerPortEmissionsMeasurement['co2']> = inputData.map((x) => x.co2).filter(Boolean);
  const ch4Items: Array<AerPortEmissionsMeasurement['ch4']> = inputData.map((x) => x.ch4).filter(Boolean);
  const n2oItems: Array<AerPortEmissionsMeasurement['n2o']> = inputData.map((x) => x.n2o).filter(Boolean);
  const totalItems: Array<AerPortEmissionsMeasurement['total']> = inputData.map((x) => x.total).filter(Boolean);

  return {
    co2: co2Items?.length && co2Items?.length === inputData.length ? bigNumberUtils.getSum(co2Items, 7) : null,
    ch4: ch4Items?.length && ch4Items?.length === inputData.length ? bigNumberUtils.getSum(ch4Items, 7) : null,
    n2o: n2oItems?.length && n2oItems?.length === inputData.length ? bigNumberUtils.getSum(n2oItems, 7) : null,
    total: totalItems?.length ? bigNumberUtils.getSum(totalItems, 7) : null,
  };
};
