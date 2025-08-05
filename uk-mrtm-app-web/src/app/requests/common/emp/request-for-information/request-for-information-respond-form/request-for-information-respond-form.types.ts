import { FormArray, FormControl, UntypedFormControl } from '@angular/forms';

export type RequestForInformationRespondFormModel = {
  answers: FormArray<FormControl>;
  files: UntypedFormControl;
};
