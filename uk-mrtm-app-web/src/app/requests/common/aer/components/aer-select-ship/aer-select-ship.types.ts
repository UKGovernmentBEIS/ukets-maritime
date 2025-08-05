import { FormControl } from '@angular/forms';

import { AerPort, AerShipAggregatedData, AerVoyage } from '@mrtm/api';

export type AerSelectShipFormModel = Pick<
  AerPort | AerVoyage | AerShipAggregatedData,
  'imoNumber' | 'uniqueIdentifier'
>;

export type AerSelectShipFormGroupModel = Record<keyof AerSelectShipFormModel, FormControl>;
