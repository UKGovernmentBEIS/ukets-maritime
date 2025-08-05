import { Provider } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { AerComplianceMonitoringReporting } from '@mrtm/api';

import { RequestTaskStore } from '@netz/common/store';
import { GovukValidators } from '@netz/govuk-components';

import { TASK_FORM } from '@requests/common/task-form.token';
import { aerVerificationSubmitQuery } from '@requests/tasks/aer-verification-submit/+state/aer-verification-submit.selectors';

export const complianceMonitoringReportingCompletenessFormProvider: Provider = {
  provide: TASK_FORM,
  deps: [FormBuilder, RequestTaskStore],
  useFactory: (formBuilder: FormBuilder, store: RequestTaskStore) => {
    const complianceMonitoringReporting = store.select(
      aerVerificationSubmitQuery.selectComplianceMonitoringReporting,
    )();

    const completenessCompliant = formBuilder.control<AerComplianceMonitoringReporting['completenessCompliant']>(
      complianceMonitoringReporting?.completenessCompliant,
      {
        updateOn: 'change',
        validators: [
          GovukValidators.required('Select yes if the maritime operator complied with the principle of completeness'),
        ],
      },
    );
    const completenessNonCompliantReason = formBuilder.control<
      AerComplianceMonitoringReporting['completenessNonCompliantReason']
    >(
      {
        value: complianceMonitoringReporting?.completenessNonCompliantReason ?? null,
        disabled: completenessCompliant.value !== false,
      },
      [
        GovukValidators.required(
          'Enter a reason why the maritime operator was not compliant with the principle of completeness',
        ),
        GovukValidators.maxLength(10000, 'Enter up to 10000 characters'),
      ],
    );

    return formBuilder.group({
      completenessCompliant,
      completenessNonCompliantReason,
    });
  },
};
