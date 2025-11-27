import { Provider } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { AerEmissionsReductionClaimVerification } from '@mrtm/api';

import { RequestTaskStore } from '@netz/common/store';
import { GovukValidators } from '@netz/govuk-components';

import { TASK_FORM } from '@requests/common';
import { aerVerificationSubmitQuery } from '@requests/tasks/aer-verification-submit/+state/aer-verification-submit.selectors';
import { EmissionsReductionClaimsVerificationFormGroup } from '@requests/tasks/aer-verification-submit/subtasks/emissions-reduction-claims-verification/emissions-reduction-claims-verification-form/emissions-reduction-claims-verification-form.types';

export const emissionsReductionClaimsVerificationFormProvider: Provider = {
  provide: TASK_FORM,
  deps: [FormBuilder, RequestTaskStore],
  useFactory: (
    formBuilder: FormBuilder,
    store: RequestTaskStore,
  ): FormGroup<EmissionsReductionClaimsVerificationFormGroup> => {
    const emissionsReductionClaimsVerification = store.select(
      aerVerificationSubmitQuery.selectEmissionsReductionClaimVerification,
    )();

    return formBuilder.group<EmissionsReductionClaimsVerificationFormGroup>({
      smfBatchClaimsReviewed: formBuilder.control<
        AerEmissionsReductionClaimVerification['smfBatchClaimsReviewed'] | null
      >(emissionsReductionClaimsVerification?.smfBatchClaimsReviewed ?? null, [
        GovukValidators.required("Select yes if you have reviewed the operator's eligible fuel batch claims"),
      ]),
      batchReferencesNotReviewed: formBuilder.control<
        AerEmissionsReductionClaimVerification['batchReferencesNotReviewed'] | null
      >(emissionsReductionClaimsVerification?.batchReferencesNotReviewed ?? null, [
        GovukValidators.required('Enter the batch references that were not reviewed'),
        GovukValidators.maxLength(10000, 'Enter up to 10000 characters'),
      ]),
      dataSampling: formBuilder.control<AerEmissionsReductionClaimVerification['dataSampling'] | null>(
        emissionsReductionClaimsVerification?.dataSampling ?? null,
        [
          GovukValidators.required(
            'Enter a description of how data sampling was carried out and the documents reviewed',
          ),
          GovukValidators.maxLength(10000, 'Enter up to 10000 characters'),
        ],
      ),
      reviewResults: formBuilder.control<AerEmissionsReductionClaimVerification['reviewResults'] | null>(
        emissionsReductionClaimsVerification?.reviewResults ?? null,
        [
          GovukValidators.required('Enter the result of your review'),
          GovukValidators.maxLength(10000, 'Enter up to 10000 characters'),
        ],
      ),
      noDoubleCountingConfirmation: formBuilder.control<
        AerEmissionsReductionClaimVerification['noDoubleCountingConfirmation'] | null
      >(emissionsReductionClaimsVerification?.noDoubleCountingConfirmation ?? null, [
        GovukValidators.required('Enter the confirmation of no double-counting'),
        GovukValidators.maxLength(10000, 'Enter up to 10000 characters'),
      ]),
      evidenceAllCriteriaMetExist: formBuilder.control<
        AerEmissionsReductionClaimVerification['evidenceAllCriteriaMetExist'] | null
      >(emissionsReductionClaimsVerification?.evidenceAllCriteriaMetExist ?? null, [
        GovukValidators.required(
          'Select yes if all batch claims contained evidence that the eligibility criteria were met',
        ),
      ]),
      noCriteriaMetIssues: formBuilder.control<AerEmissionsReductionClaimVerification['noCriteriaMetIssues'] | null>(
        emissionsReductionClaimsVerification?.noCriteriaMetIssues ?? null,
        [
          GovukValidators.required('Enter the issues that you identified'),
          GovukValidators.maxLength(10000, 'Enter up to 1000'),
        ],
      ),
      complianceWithEmpRequirementsExist: formBuilder.control<
        AerEmissionsReductionClaimVerification['complianceWithEmpRequirementsExist'] | null
      >(emissionsReductionClaimsVerification?.complianceWithEmpRequirementsExist ?? null, [
        GovukValidators.required('Select yes if the emissions reduction claim was compliant'),
      ]),
      notCompliedWithEmpRequirementsAspects: formBuilder.control<
        AerEmissionsReductionClaimVerification['notCompliedWithEmpRequirementsAspects'] | null
      >(emissionsReductionClaimsVerification?.notCompliedWithEmpRequirementsAspects ?? null, [
        GovukValidators.required('Enter a description of why the claim is not compliant'),
        GovukValidators.maxLength(10000, 'Enter up to 1000'),
      ]),
    });
  },
};
