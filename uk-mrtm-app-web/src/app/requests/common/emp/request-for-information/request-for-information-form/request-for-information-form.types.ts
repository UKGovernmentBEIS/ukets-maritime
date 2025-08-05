import { FormArray, FormControl, UntypedFormControl } from '@angular/forms';

import { RfiSubmitPayload } from '@mrtm/api';

import { UploadedFile } from '@shared/types';

export type RequestForInformationModel = Pick<RfiSubmitPayload, 'deadline' | 'questions'> & {
  files?: UploadedFile[];
};

export type RequestForInformationFormModel = {
  deadline: FormControl;
  questions: FormArray;
  files: UntypedFormControl;
};
