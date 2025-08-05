import { EmpDataGaps } from '@mrtm/api';

export const isDataGapsCompleted = (dataGaps?: EmpDataGaps) => {
  return (
    !!dataGaps?.fuelConsumptionEstimationMethod &&
    !!dataGaps?.responsiblePersonOrPosition &&
    !!dataGaps?.dataSources &&
    !!dataGaps?.recordsLocation
  );
};
