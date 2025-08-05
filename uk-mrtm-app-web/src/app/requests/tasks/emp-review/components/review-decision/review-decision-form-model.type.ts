import { FormArray, FormControl, FormGroup } from '@angular/forms';

import { EmpIssuanceReviewDecision } from '@mrtm/api';

export type ReviewDecisionFormModel = FormGroup<{
  type: FormControl<EmpIssuanceReviewDecision['type'] | null>;
  notes: FormControl<string | null>;
  requiredChanges: FormArray<FormGroup<RequiredChangeFormModel>>;
}>;

export interface RequiredChangeFormModel {
  reason: FormControl<string | null>;
  files: FormControl<{ file: File; uuid: string }[]>;
}
