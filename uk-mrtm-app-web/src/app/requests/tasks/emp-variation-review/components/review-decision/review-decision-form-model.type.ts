import { FormArray, FormControl, FormGroup } from '@angular/forms';

import { EmpVariationReviewDecision } from '@mrtm/api';

export type ReviewDecisionFormModel = FormGroup<{
  type: FormControl<EmpVariationReviewDecision['type'] | null>;
  notes: FormControl<string | null>;
  requiredChanges: FormArray<FormGroup<RequiredChangeFormModel>>;
  variationScheduleItems: FormArray<FormControl<string | null>>;
}>;

export interface RequiredChangeFormModel {
  reason: FormControl<string | null>;
  files: FormControl<{ file: File; uuid: string }[]>;
}
