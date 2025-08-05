import { Provider } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { AerComplianceMonitoringReporting } from '@mrtm/api';

import { RequestTaskStore } from '@netz/common/store';
import { GovukValidators } from '@netz/govuk-components';

import { TASK_FORM } from '@requests/common/task-form.token';
import { aerVerificationSubmitQuery } from '@requests/tasks/aer-verification-submit/+state/aer-verification-submit.selectors';

export const complianceMonitoringReportingCctFormProvider: Provider = {
  provide: TASK_FORM,
  deps: [FormBuilder, RequestTaskStore],
  useFactory: (formBuilder: FormBuilder, store: RequestTaskStore) => {
    const complianceMonitoringReporting = store.select(
      aerVerificationSubmitQuery.selectComplianceMonitoringReporting,
    )();

    const consistencyCompliant = formBuilder.control<AerComplianceMonitoringReporting['consistencyCompliant']>(
      complianceMonitoringReporting?.consistencyCompliant,
      {
        updateOn: 'change',
        validators: [
          GovukValidators.required('Select yes if the maritime operator complied with the principle of consistency'),
        ],
      },
    );
    const consistencyNonCompliantReason = formBuilder.control<
      AerComplianceMonitoringReporting['consistencyNonCompliantReason']
    >(
      {
        value: complianceMonitoringReporting?.consistencyNonCompliantReason ?? null,
        disabled: consistencyCompliant.value !== false,
      },
      [
        GovukValidators.required(
          'Enter a reason why the maritime operator was not compliant with the principle of consistency',
        ),
        GovukValidators.maxLength(10000, 'Enter up to 10000 characters'),
      ],
    );

    const comparabilityCompliant = formBuilder.control<AerComplianceMonitoringReporting['comparabilityCompliant']>(
      complianceMonitoringReporting?.comparabilityCompliant,
      {
        updateOn: 'change',
        validators: [
          GovukValidators.required(
            'Select yes if the maritime operator complied with the principle of comparability over time',
          ),
        ],
      },
    );
    const comparabilityNonCompliantReason = formBuilder.control<
      AerComplianceMonitoringReporting['comparabilityNonCompliantReason']
    >(
      {
        value: complianceMonitoringReporting?.comparabilityNonCompliantReason ?? null,
        disabled: comparabilityCompliant.value !== false,
      },
      [
        GovukValidators.required(
          'Enter a reason why the maritime operator was not compliant with the principle of comparability over time',
        ),
        GovukValidators.maxLength(10000, 'Enter up to 10000 characters'),
      ],
    );

    const transparencyCompliant = formBuilder.control<AerComplianceMonitoringReporting['transparencyCompliant']>(
      complianceMonitoringReporting?.transparencyCompliant,
      {
        updateOn: 'change',
        validators: [
          GovukValidators.required('Select yes if the maritime operator complied with the principle of transparency'),
        ],
      },
    );
    const transparencyNonCompliantReason = formBuilder.control<
      AerComplianceMonitoringReporting['transparencyNonCompliantReason']
    >(
      {
        value: complianceMonitoringReporting?.transparencyNonCompliantReason ?? null,
        disabled: transparencyCompliant.value !== false,
      },
      [
        GovukValidators.required(
          'Enter a reason why the maritime operator was not compliant with the principle of transparency',
        ),
        GovukValidators.maxLength(10000, 'Enter up to 10000 characters'),
      ],
    );

    return formBuilder.group({
      consistencyCompliant,
      consistencyNonCompliantReason,
      comparabilityCompliant,
      comparabilityNonCompliantReason,
      transparencyCompliant,
      transparencyNonCompliantReason,
    });
  },
};
