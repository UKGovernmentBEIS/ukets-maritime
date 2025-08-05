import { FormControl } from '@angular/forms';

import { AerSmf } from '@mrtm/api';

export type ReductionClaimExistFormModel = Pick<AerSmf, 'exist'>;
export type ReductionClaimExistFormGroupModel = Record<keyof ReductionClaimExistFormModel, FormControl>;
