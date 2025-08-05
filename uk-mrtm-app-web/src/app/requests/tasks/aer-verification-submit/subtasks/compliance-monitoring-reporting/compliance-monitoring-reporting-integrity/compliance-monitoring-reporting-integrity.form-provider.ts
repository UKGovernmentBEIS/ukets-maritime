import { Provider } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { AerComplianceMonitoringReporting } from '@mrtm/api';

import { RequestTaskStore } from '@netz/common/store';
import { GovukValidators } from '@netz/govuk-components';

import { TASK_FORM } from '@requests/common/task-form.token';
import { aerVerificationSubmitQuery } from '@requests/tasks/aer-verification-submit/+state/aer-verification-submit.selectors';

export const complianceMonitoringReportingIntegrityFormProvider: Provider = {
  provide: TASK_FORM,
  deps: [FormBuilder, RequestTaskStore],
  useFactory: (formBuilder: FormBuilder, store: RequestTaskStore) => {
    const complianceMonitoringReporting = store.select(
      aerVerificationSubmitQuery.selectComplianceMonitoringReporting,
    )();

    const integrityCompliant = formBuilder.control<AerComplianceMonitoringReporting['integrityCompliant']>(
      complianceMonitoringReporting?.integrityCompliant,
      {
        updateOn: 'change',
        validators: [
          GovukValidators.required(
            'Select yes if the maritime operator complied with the principle of integrity of methodology',
          ),
        ],
      },
    );
    const integrityNonCompliantReason = formBuilder.control<
      AerComplianceMonitoringReporting['integrityNonCompliantReason']
    >(
      {
        value: complianceMonitoringReporting?.integrityNonCompliantReason ?? null,
        disabled: integrityCompliant.value !== false,
      },
      [
        GovukValidators.required(
          'Enter a reason why the maritime operator was not compliant with the principle of integrity of methodology',
        ),
        GovukValidators.maxLength(10000, 'Enter up to 10000 characters'),
      ],
    );

    return formBuilder.group({
      integrityCompliant,
      integrityNonCompliantReason,
    });
  },
};
