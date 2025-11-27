import { FormControl } from '@angular/forms';

import { AerPortEmissionsMeasurement } from '@mrtm/api';

export type AerAggregatedEmissionsFormGroupModel = Record<keyof AerPortEmissionsMeasurement, FormControl>;
