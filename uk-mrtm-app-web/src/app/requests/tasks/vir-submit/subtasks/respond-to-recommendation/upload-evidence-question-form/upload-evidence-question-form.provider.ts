import { Provider } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { RequestTaskStore } from '@netz/common/store';
import { GovukValidators } from '@netz/govuk-components';

import { TASK_FORM } from '@requests/common';
import { virCommonQuery } from '@requests/common/vir/+state';
import {
  UploadEvidenceQuestionFormGroup,
  UploadEvidenceQuestionFormModel,
} from '@requests/tasks/vir-submit/subtasks/respond-to-recommendation/upload-evidence-question-form/upload-evidence-question-form.types';

export const uploadEvidenceQuestionFormProvider: Provider = {
  provide: TASK_FORM,
  deps: [FormBuilder, RequestTaskStore, ActivatedRoute],
  useFactory: (
    formBuilder: FormBuilder,
    store: RequestTaskStore,
    activatedRoute: ActivatedRoute,
  ): FormGroup<UploadEvidenceQuestionFormGroup> => {
    const key = activatedRoute.snapshot.params?.['key'];
    const operatorResponse = store.select(virCommonQuery.selectOperatorResponseData(key))();

    return formBuilder.group({
      key: formBuilder.control<UploadEvidenceQuestionFormModel['key'] | null>(key),
      uploadEvidence: formBuilder.control<UploadEvidenceQuestionFormModel['uploadEvidence'] | null>(
        operatorResponse?.uploadEvidence,
        {
          validators: GovukValidators.required('Select yes if you like to upload evidence to support your response'),
        },
      ),
    });
  },
};
