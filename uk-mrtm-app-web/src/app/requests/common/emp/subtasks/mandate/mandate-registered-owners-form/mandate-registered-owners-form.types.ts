import { FormControl } from '@angular/forms';

import { EmpRegisteredOwner, ShipDetails } from '@mrtm/api';

import { MultiSelectedItem } from '@shared/components';

export type MandateRegisteredOwnersFormModel = EmpRegisteredOwner;

export type MandateRegisteredOwnersFormGroupModel = Record<keyof MandateRegisteredOwnersFormModel, FormControl>;
export type MandateShipSelectItem = MultiSelectedItem<Pick<ShipDetails, 'imoNumber' | 'name'>>;
