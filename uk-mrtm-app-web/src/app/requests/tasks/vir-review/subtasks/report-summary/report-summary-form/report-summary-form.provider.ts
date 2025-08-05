import { Provider } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { RequestTaskStore } from '@netz/common/store';
import { GovukValidators } from '@netz/govuk-components';

import { TASK_FORM } from '@requests/common';
import { virReviewQuery } from '@requests/tasks/vir-review/+state';
import {
  ReportSummaryFormGroupModel,
  ReportSummaryFormModel,
} from '@requests/tasks/vir-review/subtasks/report-summary/report-summary-form/report-summary-form.types';

export const reportSummaryFormProvider: Provider = {
  provide: TASK_FORM,
  deps: [FormBuilder, RequestTaskStore],
  useFactory: (formBuilder: FormBuilder, store: RequestTaskStore): FormGroup<ReportSummaryFormGroupModel> => {
    const regulatorResponse = store.select(virReviewQuery.selectPayload)()?.regulatorReviewResponse;

    return formBuilder.group({
      reportSummary: formBuilder.control<ReportSummaryFormModel['reportSummary'] | null>(
        regulatorResponse?.reportSummary,
        {
          validators: [
            GovukValidators.required('Enter your summary response for the operator'),
            GovukValidators.maxLength(10000, 'Enter up to 10000 characters'),
          ],
        },
      ),
    });
  },
};
