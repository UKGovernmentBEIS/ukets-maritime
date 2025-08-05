import { FormControl } from '@angular/forms';

import { ShipDetails } from '@mrtm/api';

export type ShipDetailsFormModel = ShipDetails & { uniqueIdentifier: string };

export type ShipDetailsFormGroup = Record<keyof ShipDetailsFormModel, FormControl>;
