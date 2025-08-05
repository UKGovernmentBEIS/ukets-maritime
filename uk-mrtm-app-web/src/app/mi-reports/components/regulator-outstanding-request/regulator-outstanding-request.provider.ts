import { Provider } from '@angular/core';
import { FormBuilder, FormGroup, UntypedFormGroup } from '@angular/forms';

import { MI_REPORT_FORM_GROUP } from '@mi-reports/core/mi-report.providers';

export const regulatorOutstandingRequestProvider: Provider = {
  provide: MI_REPORT_FORM_GROUP,
  deps: [FormBuilder],
  useFactory:
    (formBuilder: FormBuilder): (() => FormGroup | UntypedFormGroup) =>
    () =>
      formBuilder.group({
        requestTaskTypes: [[]],
        userIds: [[]],
      }),
};
