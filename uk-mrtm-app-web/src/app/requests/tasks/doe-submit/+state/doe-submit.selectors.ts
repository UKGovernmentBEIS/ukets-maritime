import { DoeMaritimeEmissions } from '@mrtm/api';

import { createDescendingSelector, RequestTaskState, StateSelector } from '@netz/common/store';

import { doeCommonQuery } from '@requests/common/doe';

const selectDeterminationReason: StateSelector<RequestTaskState, DoeMaritimeEmissions['determinationReason']> =
  createDescendingSelector(
    doeCommonQuery.selectMaritimeEmissions,
    (maritimeEmissions) => maritimeEmissions?.determinationReason,
  );

const selectTotalMaritimeEmissions: StateSelector<RequestTaskState, DoeMaritimeEmissions['totalMaritimeEmissions']> =
  createDescendingSelector(
    doeCommonQuery.selectMaritimeEmissions,
    (maritimeEmissions) => maritimeEmissions?.totalMaritimeEmissions,
  );

const selectChargeOperator: StateSelector<RequestTaskState, DoeMaritimeEmissions['chargeOperator']> =
  createDescendingSelector(
    doeCommonQuery.selectMaritimeEmissions,
    (maritimeEmissions) => maritimeEmissions?.chargeOperator,
  );

const selectFeeDetails: StateSelector<RequestTaskState, DoeMaritimeEmissions['feeDetails']> = createDescendingSelector(
  doeCommonQuery.selectMaritimeEmissions,
  (maritimeEmissions) => maritimeEmissions?.feeDetails,
);

export const doeSubmitQuery = {
  selectDeterminationReason,
  selectTotalMaritimeEmissions,
  selectChargeOperator,
  selectFeeDetails,
};
