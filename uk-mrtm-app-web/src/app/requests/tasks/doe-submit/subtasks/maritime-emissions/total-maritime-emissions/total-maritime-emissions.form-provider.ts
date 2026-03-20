import { Provider } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidatorFn } from '@angular/forms';

import { DoeTotalMaritimeEmissions } from '@mrtm/api';

import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';
import { GovukValidators } from '@netz/govuk-components';

import { doeCommonQuery } from '@requests/common/doe';
import { TASK_FORM } from '@requests/common/task-form.token';
import { doeSubmitQuery } from '@requests/tasks/doe-submit/+state';
import { taskActionTypeToUploadSectionTaskActionTypeMap } from '@shared/constants/upload-attachment-request-task-action-type.map';
import { RequestTaskFileService } from '@shared/services';
import { isEmpty } from '@shared/utils';

export type TotalMaritimeEmissionsFormModel = Record<keyof DoeTotalMaritimeEmissions, FormControl>;

const niDeductionLessThanTotalEmissionsValidator = (): ValidatorFn => {
  return (group: FormGroup<TotalMaritimeEmissionsFormModel>) => {
    const niDeductionCtrl = group.controls.lessVoyagesInNorthernIrelandDeduction;
    const totalEmissionsCtrl = group.controls.totalReportableEmissions;

    if (Number(niDeductionCtrl.value) > Number(totalEmissionsCtrl.value)) {
      niDeductionCtrl.setErrors({
        ...niDeductionCtrl.errors,
        invalidLessVoyagesInNorthernIrelandDeduction: `The Northern Ireland surrender deduction must be less than or equal to the total maritime emissions`,
      });
    } else {
      if (niDeductionCtrl.errors?.invalidLessVoyagesInNorthernIrelandDeduction) {
        delete niDeductionCtrl.errors.invalidLessVoyagesInNorthernIrelandDeduction;
        const existingErrors = structuredClone(niDeductionCtrl.errors);
        // Workaround to trigger the UI refresh on `govuk-error-message`
        // Sets it to null, then sets it to previous errors if they exist
        niDeductionCtrl.setErrors(null);
        if (!isEmpty(existingErrors)) {
          niDeductionCtrl.setErrors(existingErrors);
        }
      }
    }

    return null;
  };
};

const surrenderEmissionsLessThanNIDeductionValidator = (): ValidatorFn => {
  return (group: FormGroup<TotalMaritimeEmissionsFormModel>) => {
    const surrenderEmissionsCtrl = group.controls.surrenderEmissions;
    const niDeductionCtrl = group.controls.lessVoyagesInNorthernIrelandDeduction;

    if (Number(surrenderEmissionsCtrl.value) > Number(niDeductionCtrl.value)) {
      surrenderEmissionsCtrl.setErrors({
        ...surrenderEmissionsCtrl.errors,
        invalidSurrenderEmissions: `The emissions figure for surrender must be less than or equal to the Northern Ireland surrender deduction`,
      });
    } else {
      if (surrenderEmissionsCtrl.errors?.invalidSurrenderEmissions) {
        delete surrenderEmissionsCtrl.errors.invalidSurrenderEmissions;
        const existingErrors = structuredClone(surrenderEmissionsCtrl.errors);
        // Workaround to trigger the UI refresh on `govuk-error-message`
        // Sets it to null, then sets it to previous errors if they exist
        surrenderEmissionsCtrl.setErrors(null);
        if (!isEmpty(existingErrors)) {
          surrenderEmissionsCtrl.setErrors(existingErrors);
        }
      }
    }

    return null;
  };
};

export const totalMaritimeEmissionsFormProvider: Provider = {
  provide: TASK_FORM,
  deps: [FormBuilder, RequestTaskStore, RequestTaskFileService],
  useFactory: (
    fb: FormBuilder,
    store: RequestTaskStore,
    fileService: RequestTaskFileService,
  ): FormGroup<TotalMaritimeEmissionsFormModel> => {
    const requestTaskId = store.select(requestTaskQuery.selectRequestTaskId)();
    const requestTaskType = store.select(requestTaskQuery.selectRequestTaskType)();
    const isEditable = store.select(requestTaskQuery.selectIsEditable)();

    const doeAttachments = store.select(doeCommonQuery.selectAttachments)();
    const totalMaritimeEmissions = store.select(doeSubmitQuery.selectTotalMaritimeEmissions)();

    return fb.group(
      {
        determinationType: fb.control<DoeTotalMaritimeEmissions['determinationType']>(
          totalMaritimeEmissions?.determinationType ?? null,
          {
            validators: [
              GovukValidators.required(
                'Select if you are determining maritime emissions or only the emissions figure for surrender',
              ),
            ],
          },
        ),
        totalReportableEmissions: fb.control<DoeTotalMaritimeEmissions['totalReportableEmissions']>(
          totalMaritimeEmissions?.totalReportableEmissions ?? null,
          {
            validators: [
              GovukValidators.required('Enter the total maritime emissions'),
              GovukValidators.integerNumber(
                'The total maritime emissions must be a whole number equal to or greater than 0',
              ),
            ],
          },
        ),
        lessVoyagesInNorthernIrelandDeduction: fb.control<
          DoeTotalMaritimeEmissions['lessVoyagesInNorthernIrelandDeduction']
        >(totalMaritimeEmissions?.lessVoyagesInNorthernIrelandDeduction ?? null, {
          validators: [
            GovukValidators.required('Enter the Northern Ireland surrender deduction'),
            GovukValidators.integerNumber(
              'The Northern Ireland surrender deduction must be a whole number equal to or greater than 0',
            ),
          ],
        }),
        surrenderEmissions: fb.control<DoeTotalMaritimeEmissions['surrenderEmissions']>(
          totalMaritimeEmissions?.surrenderEmissions ?? null,
          {
            validators: [
              GovukValidators.required('Enter the emissions figure for surrender'),
              GovukValidators.integerNumber(
                'The emissions figure for surrender must be a whole number equal to or greater than 0',
              ),
            ],
          },
        ),
        calculationApproach: fb.control<DoeTotalMaritimeEmissions['calculationApproach']>(
          totalMaritimeEmissions?.calculationApproach ?? null,
          {
            validators: [
              GovukValidators.required('Enter how you calculated the emissions'),
              GovukValidators.maxLength(10000, 'Enter up to 10000 characters'),
            ],
          },
        ),
        supportingDocuments: fileService.buildFormControl(
          requestTaskId,
          totalMaritimeEmissions?.supportingDocuments ?? [],
          doeAttachments,
          taskActionTypeToUploadSectionTaskActionTypeMap?.[requestTaskType],
          false,
          !isEditable,
        ),
      },
      {
        validators: [niDeductionLessThanTotalEmissionsValidator(), surrenderEmissionsLessThanNIDeductionValidator()],
      },
    );
  },
};
