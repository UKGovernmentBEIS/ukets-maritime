import { Provider } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { AerComplianceMonitoringReporting } from '@mrtm/api';

import { RequestTaskStore } from '@netz/common/store';
import { GovukValidators } from '@netz/govuk-components';

import { TASK_FORM } from '@requests/common/task-form.token';
import { aerVerificationSubmitQuery } from '@requests/tasks/aer-verification-submit/+state/aer-verification-submit.selectors';

export const complianceMonitoringReportingAccuracyFormProvider: Provider = {
  provide: TASK_FORM,
  deps: [FormBuilder, RequestTaskStore],
  useFactory: (formBuilder: FormBuilder, store: RequestTaskStore) => {
    const complianceMonitoringReporting = store.select(
      aerVerificationSubmitQuery.selectComplianceMonitoringReporting,
    )();

    const accuracyCompliant = formBuilder.control<AerComplianceMonitoringReporting['accuracyCompliant']>(
      complianceMonitoringReporting?.accuracyCompliant,
      {
        updateOn: 'change',
        validators: [
          GovukValidators.required('Select yes if the maritime operator complied with the principle of accuracy'),
        ],
      },
    );
    const accuracyNonCompliantReason = formBuilder.control<
      AerComplianceMonitoringReporting['accuracyNonCompliantReason']
    >(
      {
        value: complianceMonitoringReporting?.accuracyNonCompliantReason ?? null,
        disabled: accuracyCompliant.value !== false,
      },
      [
        GovukValidators.required(
          'Enter a reason why the maritime operator was not compliant with the principle of accuracy',
        ),
        GovukValidators.maxLength(10000, 'Enter up to 10000 characters'),
      ],
    );

    return formBuilder.group({
      accuracyCompliant,
      accuracyNonCompliantReason,
    });
  },
};
