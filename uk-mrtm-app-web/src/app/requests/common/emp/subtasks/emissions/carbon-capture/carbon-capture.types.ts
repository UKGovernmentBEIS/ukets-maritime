import { FormControl, FormGroup } from '@angular/forms';

export interface EmpCarbonCaptureTechnologiesFormModel {
  description: FormControl<string | null>;
  files: FormControl<string[] | null>;
  technologyEmissionSources: FormControl<string[] | null>;
}

export interface EmpCarbonCaptureFormModel {
  exist: FormControl<boolean | null>;
  technologies: FormGroup<EmpCarbonCaptureTechnologiesFormModel>;
}

export interface CarbonCaptureFormModel {
  carbonCapture: FormGroup<EmpCarbonCaptureFormModel>;
}
