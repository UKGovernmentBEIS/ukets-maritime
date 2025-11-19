import { FormControl, FormGroup } from '@angular/forms';

import { AerShipAggregatedData } from '@mrtm/api';

export type AerAggregatedDataEmissionsForSmallIslandFormModel = Pick<
  AerShipAggregatedData,
  'uniqueIdentifier' | 'smallIslandSurrenderReduction'
>;

export interface AerAggregatedDataEmissionsForSmallIslandFormGroupModel {
  uniqueIdentifier: FormControl;
  smallIslandSurrenderReduction: FormGroup;
}
