import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';

import { EmpAbbreviationDefinition } from '@mrtm/api';

import { RequestTaskStore } from '@netz/common/store';
import { GovukValidators } from '@netz/govuk-components';

import { empCommonQuery } from '@requests/common/emp/+state';
import { TASK_FORM } from '@requests/common/task-form.token';

export const abbreviationsQuestionFormProvider = {
  provide: TASK_FORM,
  deps: [UntypedFormBuilder, RequestTaskStore],
  useFactory: (fb: UntypedFormBuilder, store: RequestTaskStore) => {
    const abbreviations = store.select(empCommonQuery.selectAbbreviations)();

    return fb.group(
      {
        exist: fb.control(abbreviations?.exist ?? null, {
          validators: [
            GovukValidators.required(
              'Select ‘Yes’, if you are using any abbreviations or terminology in your application which need explanation',
            ),
          ],
        }),
        abbreviationDefinitions: fb.array(
          abbreviations?.abbreviationDefinitions?.map(addAbbreviationDefinitionGroup) ?? [],
        ),
      },
      { updateOn: 'change' },
    );
  },
};

export function addAbbreviationDefinitionGroup(value?: EmpAbbreviationDefinition): UntypedFormGroup {
  return new UntypedFormGroup({
    abbreviation: new UntypedFormControl(value?.abbreviation ?? null, [
      GovukValidators.required('Enter an abbreviation or term used'),
      GovukValidators.maxLength(30, 'Enter up to 30 characters'),
    ]),
    definition: new UntypedFormControl(value?.definition ?? null, [
      GovukValidators.required('Enter a definition'),
      GovukValidators.maxLength(255, 'Enter up to 255 characters'),
    ]),
  });
}
