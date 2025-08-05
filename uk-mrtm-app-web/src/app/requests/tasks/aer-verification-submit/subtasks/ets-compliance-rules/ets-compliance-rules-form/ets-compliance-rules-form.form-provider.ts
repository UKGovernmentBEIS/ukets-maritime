import { Provider } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { AerEtsComplianceRules } from '@mrtm/api';

import { RequestTaskStore } from '@netz/common/store';
import { GovukValidators } from '@netz/govuk-components';

import { TASK_FORM } from '@requests/common/task-form.token';
import { aerVerificationSubmitQuery } from '@requests/tasks/aer-verification-submit/+state/aer-verification-submit.selectors';

export const etsComplianceRulesFormProvider: Provider = {
  provide: TASK_FORM,
  deps: [FormBuilder, RequestTaskStore],
  useFactory: (formBuilder: FormBuilder, store: RequestTaskStore) => {
    const etsComplianceRules = store.select(aerVerificationSubmitQuery.selectEtsComplianceRules)();

    const monitoringPlanRequirementsMet = formBuilder.control<AerEtsComplianceRules['monitoringPlanRequirementsMet']>(
      etsComplianceRules?.monitoringPlanRequirementsMet,
      {
        updateOn: 'change',
        validators: [
          GovukValidators.required(
            'Select yes if the emissions monitoring plan requirements and conditions have been met',
          ),
        ],
      },
    );
    const monitoringPlanRequirementsNotMetReason = formBuilder.control<
      AerEtsComplianceRules['monitoringPlanRequirementsNotMetReason']
    >(
      {
        value: etsComplianceRules?.monitoringPlanRequirementsNotMetReason ?? null,
        disabled: monitoringPlanRequirementsMet.value !== false,
      },
      [
        GovukValidators.required(
          'Enter a reason why the emissions monitoring plan requirements and conditions have not been met',
        ),
        GovukValidators.maxLength(10000, 'Enter up to 10000 characters'),
      ],
    );

    const etsOrderRequirementsMet = formBuilder.control<AerEtsComplianceRules['etsOrderRequirementsMet']>(
      etsComplianceRules?.etsOrderRequirementsMet,
      {
        updateOn: 'change',
        validators: [GovukValidators.required('Select yes if the requirements of the UK ETS Order have been met')],
      },
    );
    const etsOrderRequirementsNotMetReason = formBuilder.control<
      AerEtsComplianceRules['etsOrderRequirementsNotMetReason']
    >(
      {
        value: etsComplianceRules?.etsOrderRequirementsNotMetReason ?? null,
        disabled: etsOrderRequirementsMet.value !== false,
      },
      [
        GovukValidators.required('Enter a reason why the requirements of the UK ETS Order have not been met'),
        GovukValidators.maxLength(10000, 'Enter up to 10000 characters'),
      ],
    );

    const detailSourceDataVerified = formBuilder.control<AerEtsComplianceRules['detailSourceDataVerified']>(
      etsComplianceRules?.detailSourceDataVerified,
      {
        updateOn: 'change',
        validators: [GovukValidators.required('Select yes if you can verify the detail and source of data')],
      },
    );
    const detailSourceDataNotVerifiedReason = formBuilder.control<
      AerEtsComplianceRules['detailSourceDataNotVerifiedReason']
    >(
      {
        value: etsComplianceRules?.detailSourceDataNotVerifiedReason ?? null,
        disabled: detailSourceDataVerified.value !== false,
      },
      [
        GovukValidators.required('Enter a reason why you cannot verify the detail and source of data'),
        GovukValidators.maxLength(10000, 'Enter up to 10000 characters'),
      ],
    );
    const partOfSiteVerification = formBuilder.control<AerEtsComplianceRules['partOfSiteVerification']>(
      {
        value: etsComplianceRules?.partOfSiteVerification ?? null,
        disabled: detailSourceDataVerified.value !== true,
      },
      [
        GovukValidators.required('Enter if this was part of site verification'),
        GovukValidators.maxLength(10000, 'Enter up to 10000 characters'),
      ],
    );

    const controlActivitiesDocumented = formBuilder.control<AerEtsComplianceRules['controlActivitiesDocumented']>(
      etsComplianceRules?.controlActivitiesDocumented,
      {
        updateOn: 'change',
        validators: [
          GovukValidators.required(
            'Select yes if control activities were documented, implemented, maintained and effective to reduce any risks',
          ),
        ],
      },
    );
    const controlActivitiesNotDocumentedReason = formBuilder.control<
      AerEtsComplianceRules['controlActivitiesNotDocumentedReason']
    >(
      {
        value: etsComplianceRules?.controlActivitiesNotDocumentedReason ?? null,
        disabled: controlActivitiesDocumented.value !== false,
      },
      [
        GovukValidators.required(
          'Enter a reason why control activities were not documented, implemented, maintained and effective to reduce any risks',
        ),
        GovukValidators.maxLength(10000, 'Enter up to 10000 characters'),
      ],
    );

    const proceduresMonitoringPlanDocumented = formBuilder.control<
      AerEtsComplianceRules['proceduresMonitoringPlanDocumented']
    >(etsComplianceRules?.proceduresMonitoringPlanDocumented, {
      updateOn: 'change',
      validators: [
        GovukValidators.required(
          'Select yes if procedures in the emissions monitoring plan were documented, implemented, maintained and effective to reduce any risks',
        ),
      ],
    });
    const proceduresMonitoringPlanNotDocumentedReason = formBuilder.control<
      AerEtsComplianceRules['proceduresMonitoringPlanNotDocumentedReason']
    >(
      {
        value: etsComplianceRules?.proceduresMonitoringPlanNotDocumentedReason ?? null,
        disabled: proceduresMonitoringPlanDocumented.value !== false,
      },
      [
        GovukValidators.required(
          'Enter a reason why procedures in the emissions monitoring plan were not documented, implemented, maintained and effective to reduce any risks',
        ),
        GovukValidators.maxLength(10000, 'Enter up to 10000 characters'),
      ],
    );

    const dataVerificationCompleted = formBuilder.control<AerEtsComplianceRules['dataVerificationCompleted']>(
      etsComplianceRules?.dataVerificationCompleted,
      {
        updateOn: 'change',
        validators: [GovukValidators.required('Select yes if data verification has been completed as required')],
      },
    );
    const dataVerificationNotCompletedReason = formBuilder.control<
      AerEtsComplianceRules['dataVerificationNotCompletedReason']
    >(
      {
        value: etsComplianceRules?.dataVerificationNotCompletedReason ?? null,
        disabled: dataVerificationCompleted.value !== false,
      },
      [
        GovukValidators.required('Enter a reason why data verification has not been completed as required'),
        GovukValidators.maxLength(10000, 'Enter up to 10000 characters'),
      ],
    );

    const monitoringApproachAppliedCorrectly = formBuilder.control<
      AerEtsComplianceRules['monitoringApproachAppliedCorrectly']
    >(etsComplianceRules?.monitoringApproachAppliedCorrectly, {
      updateOn: 'change',
      validators: [GovukValidators.required('Select yes if the monitoring approaches have been applied correctly')],
    });
    const monitoringApproachNotAppliedCorrectlyReason = formBuilder.control<
      AerEtsComplianceRules['monitoringApproachNotAppliedCorrectlyReason']
    >(
      {
        value: etsComplianceRules?.monitoringApproachNotAppliedCorrectlyReason ?? null,
        disabled: monitoringApproachAppliedCorrectly.value !== false,
      },
      [
        GovukValidators.required('Enter a reason why the monitoring approaches have not been applied correctly'),
        GovukValidators.maxLength(10000, 'Enter up to 10000 characters'),
      ],
    );

    const methodsApplyingMissingDataUsed = formBuilder.control<AerEtsComplianceRules['methodsApplyingMissingDataUsed']>(
      etsComplianceRules?.methodsApplyingMissingDataUsed,
      {
        updateOn: 'change',
        validators: [GovukValidators.required('Select yes if methods used for applying missing data were appropriate')],
      },
    );
    const methodsApplyingMissingDataNotUsedReason = formBuilder.control<
      AerEtsComplianceRules['methodsApplyingMissingDataNotUsedReason']
    >(
      {
        value: etsComplianceRules?.methodsApplyingMissingDataNotUsedReason ?? null,
        disabled: methodsApplyingMissingDataUsed.value !== false,
      },
      [
        GovukValidators.required('Enter a reason why methods used for applying missing data were not appropriate'),
        GovukValidators.maxLength(10000, 'Enter up to 10000 characters'),
      ],
    );

    const competentAuthorityGuidanceMet = formBuilder.control<AerEtsComplianceRules['competentAuthorityGuidanceMet']>(
      etsComplianceRules?.competentAuthorityGuidanceMet,
      {
        updateOn: 'change',
        validators: [
          GovukValidators.required(
            'Select yes if any relevant regulator guidance on monitoring and reporting has been met',
          ),
        ],
      },
    );
    const competentAuthorityGuidanceNotMetReason = formBuilder.control<
      AerEtsComplianceRules['competentAuthorityGuidanceNotMetReason']
    >(
      {
        value: etsComplianceRules?.competentAuthorityGuidanceNotMetReason ?? null,
        disabled: competentAuthorityGuidanceMet.value !== false,
      },
      [
        GovukValidators.required(
          'Enter a reason why any relevant regulator guidance on monitoring and reporting has not been met',
        ),
        GovukValidators.maxLength(10000, 'Enter up to 10000 characters'),
      ],
    );

    const nonConformities = formBuilder.control<AerEtsComplianceRules['nonConformities']>(
      etsComplianceRules?.nonConformities,
      {
        updateOn: 'change',
        validators: [GovukValidators.required('Select if any non-conformities from last year have been corrected')],
      },
    );
    const nonConformitiesDetails = formBuilder.control<AerEtsComplianceRules['nonConformitiesDetails']>(
      {
        value: etsComplianceRules?.nonConformitiesDetails ?? null,
        disabled: nonConformities.value !== 'NO',
      },
      [
        GovukValidators.required('Enter a reason why non-conformities from last year have not been corrected'),
        GovukValidators.maxLength(10000, 'Enter up to 10000 characters'),
      ],
    );

    return formBuilder.group({
      monitoringPlanRequirementsMet,
      monitoringPlanRequirementsNotMetReason,
      etsOrderRequirementsMet,
      etsOrderRequirementsNotMetReason,
      detailSourceDataVerified,
      detailSourceDataNotVerifiedReason,
      partOfSiteVerification,
      controlActivitiesDocumented,
      controlActivitiesNotDocumentedReason,
      proceduresMonitoringPlanDocumented,
      proceduresMonitoringPlanNotDocumentedReason,
      dataVerificationCompleted,
      dataVerificationNotCompletedReason,
      monitoringApproachAppliedCorrectly,
      monitoringApproachNotAppliedCorrectlyReason,
      methodsApplyingMissingDataUsed,
      methodsApplyingMissingDataNotUsedReason,
      competentAuthorityGuidanceMet,
      competentAuthorityGuidanceNotMetReason,
      nonConformities,
      nonConformitiesDetails,
    });
  },
};
