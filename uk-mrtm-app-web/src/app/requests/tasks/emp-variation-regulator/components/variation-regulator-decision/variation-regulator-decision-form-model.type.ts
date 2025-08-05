import { FormArray, FormControl, FormGroup } from '@angular/forms';

export type VariationRegulatorDecisionFormModel = FormGroup<{
  notes: FormControl<string | null>;
  variationScheduleItems: FormArray<FormGroup<VariationScheduleItemFormModel>>;
}>;

export interface VariationScheduleItemFormModel {
  item: FormControl<string | null>;
}
