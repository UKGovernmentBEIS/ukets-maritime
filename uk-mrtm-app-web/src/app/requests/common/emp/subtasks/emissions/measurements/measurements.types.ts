import { FormArray, FormControl, FormGroup } from '@angular/forms';

export interface MeasurementDescriptionFormModel {
  name: FormControl<string | null>;
  technicalDescription: FormControl<string | null>;
  emissionSources: FormControl<string[] | null>;
}

export type MeasurementDescriptionFormGroup = FormGroup<MeasurementDescriptionFormModel>;

export interface MeasurementsFormModel {
  measurements: FormArray<MeasurementDescriptionFormGroup>;
}
