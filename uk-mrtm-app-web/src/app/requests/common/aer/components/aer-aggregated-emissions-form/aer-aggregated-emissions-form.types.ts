import { FormControl } from '@angular/forms';

import { AerAggregatedEmissionsMeasurement } from '@mrtm/api';

export type AerAggregatedEmissionsFormGroupModel = Record<keyof AerAggregatedEmissionsMeasurement, FormControl>;
