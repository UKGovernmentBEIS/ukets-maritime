import { FormControl } from '@angular/forms';

import { AerDerogations } from '@mrtm/api';

export type AerDerogationsFormModel = AerDerogations & { uniqueIdentifier: string };

export type AerDerogationsFormGroup = Record<keyof AerDerogationsFormModel, FormControl>;
