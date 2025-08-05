import { FormArray, FormControl, FormGroup } from '@angular/forms';

import { EmpShipEmissions, UncertaintyLevel } from '@mrtm/api';

export type UncertaintyLevelItemFormModel = Record<keyof UncertaintyLevel, FormControl>;

export type UncertaintyLevelModel = {
  shipId: EmpShipEmissions['uniqueIdentifier'];
  uncertaintyLevels: UncertaintyLevel[];
};

export type UncertaintyLevelFormModel = {
  shipId: FormControl<EmpShipEmissions['uniqueIdentifier']>;
  uncertaintyLevels: FormArray<FormGroup<UncertaintyLevelItemFormModel>>;
};
