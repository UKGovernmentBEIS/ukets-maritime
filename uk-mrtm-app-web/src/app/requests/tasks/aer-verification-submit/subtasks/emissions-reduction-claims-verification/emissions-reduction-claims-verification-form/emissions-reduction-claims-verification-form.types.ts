import { FormControl } from '@angular/forms';

import { AerEmissionsReductionClaimVerification } from '@mrtm/api';

export type EmissionsReductionClaimsVerificationFormGroup = Record<
  keyof AerEmissionsReductionClaimVerification,
  FormControl
>;
