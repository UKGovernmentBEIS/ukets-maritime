import { AbstractControl } from '@angular/forms';

import { AerSmfPurchase, FuelOriginTypeName } from '@mrtm/api';

export type ReductionClaimFuelPurchaseFormModel = Omit<AerSmfPurchase, 'fuelOriginTypeName'> & {
  fuelOriginTypeName: FuelOriginTypeName['uniqueIdentifier'];
};

export type ReductionClaimFuelPurchaseFormGroupModel = Record<
  keyof ReductionClaimFuelPurchaseFormModel,
  AbstractControl
>;
