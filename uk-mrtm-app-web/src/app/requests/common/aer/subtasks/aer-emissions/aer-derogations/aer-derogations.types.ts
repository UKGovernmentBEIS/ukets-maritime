import { FormControl } from '@angular/forms';

import { AerDerogations } from '@mrtm/api';

export type AerDerogationsFormModel = Pick<AerDerogations, 'exceptionFromPerVoyageMonitoring'> & {
  uniqueIdentifier: string;
};

export type AerDerogationsFormGroup = Record<keyof AerDerogationsFormModel, FormControl>;
