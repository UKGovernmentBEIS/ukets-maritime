import { Provider } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { AerNotVerifiedDecision, AerNotVerifiedDecisionReason } from '@mrtm/api';

import { RequestTaskStore } from '@netz/common/store';
import { GovukValidators } from '@netz/govuk-components';

import { TASK_FORM } from '@requests/common/task-form.token';
import { aerVerificationSubmitQuery } from '@requests/tasks/aer-verification-submit/+state/aer-verification-submit.selectors';

export const overallVerificationDecisionNotVerifiedReasonsProvider: Provider = {
  provide: TASK_FORM,
  deps: [FormBuilder, RequestTaskStore],
  useFactory: (formBuilder: FormBuilder, store: RequestTaskStore) => {
    const notVerifiedReasons = (
      store.select(aerVerificationSubmitQuery.selectOverallVerificationDecision)() as AerNotVerifiedDecision
    ).notVerifiedReasons;

    const reasons = formBuilder.control<AerNotVerifiedDecisionReason['type'][]>(
      (notVerifiedReasons ?? []).map(({ type }) => type),
      [GovukValidators.required('Select at least one reason why the report cannot be verified')],
    );
    return formBuilder.group({
      reasons,

      detailsVerificationDataLimitations: formBuilder.control<AerNotVerifiedDecisionReason['details']>(
        {
          value: notVerifiedReasons?.find(({ type }) => type === 'VERIFICATION_DATA_OR_INFORMATION_LIMITATIONS')
            ?.details,
          disabled: reasons.value.includes('VERIFICATION_DATA_OR_INFORMATION_LIMITATIONS'),
        },
        [
          GovukValidators.required(
            'Enter a reason why the report cannot be verified due to limitations in the data or information made available',
          ),
          GovukValidators.maxLength(10000, 'Enter up to 10000 characters'),
        ],
      ),
      detailsScopeLimitationsClarity: formBuilder.control<AerNotVerifiedDecisionReason['details']>(
        {
          value: notVerifiedReasons?.find(({ type }) => type === 'SCOPE_LIMITATIONS_DUE_TO_LACK_OF_CLARITY')?.details,
          disabled: reasons.value.includes('SCOPE_LIMITATIONS_DUE_TO_LACK_OF_CLARITY'),
        },
        [
          GovukValidators.required(
            'Enter a reason why the report cannot be verified because of limitations of scope due to lack of clarity',
          ),
          GovukValidators.maxLength(10000, 'Enter up to 10000 characters'),
        ],
      ),
      detailsScopeLimitationsEmp: formBuilder.control<AerNotVerifiedDecisionReason['details']>(
        {
          value: notVerifiedReasons?.find(({ type }) => type === 'SCOPE_LIMITATIONS_OF_APPROVED_MONITORING_PLAN')
            ?.details,
          disabled: reasons.value.includes('SCOPE_LIMITATIONS_OF_APPROVED_MONITORING_PLAN'),
        },
        [
          GovukValidators.required(
            'Enter a reason why the report cannot be verified due to limitations of scope of the approved emissions monitoring plan',
          ),
          GovukValidators.maxLength(10000, 'Enter up to 10000 characters'),
        ],
      ),
      detailsEmpNotApproved: formBuilder.control<AerNotVerifiedDecisionReason['details']>(
        {
          value: notVerifiedReasons?.find(({ type }) => type === 'NOT_APPROVED_MONITORING_PLAN_BY_REGULATOR')?.details,
          disabled: reasons.value.includes('NOT_APPROVED_MONITORING_PLAN_BY_REGULATOR'),
        },
        [
          GovukValidators.required(
            'Enter a reason why the report cannot be verified due to the emissions monitoring plan is not approved by the regulator',
          ),
          GovukValidators.maxLength(10000, 'Enter up to 10000 characters'),
        ],
      ),
      detailsAnotherReason: formBuilder.control<AerNotVerifiedDecisionReason['details']>(
        {
          value: notVerifiedReasons?.find(({ type }) => type === 'ANOTHER_REASON')?.details,
          disabled: reasons.value.includes('ANOTHER_REASON'),
        },
        [
          GovukValidators.required('Enter a reason why the report cannot be verified'),
          GovukValidators.maxLength(10000, 'Enter up to 10000 characters'),
        ],
      ),
    });
  },
};
