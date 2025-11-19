import { Provider } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { DoeTotalMaritimeEmissions } from '@mrtm/api';

import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';
import { GovukValidators } from '@netz/govuk-components';

import { doeCommonQuery } from '@requests/common/doe';
import { TASK_FORM } from '@requests/common/task-form.token';
import { doeSubmitQuery } from '@requests/tasks/doe-submit/+state';
import { taskActionTypeToUploadSectionTaskActionTypeMap } from '@shared/constants/upload-attachment-request-task-action-type.map';
import { RequestTaskFileService } from '@shared/services';

export const totalMaritimeEmissionsFormProvider: Provider = {
  provide: TASK_FORM,
  deps: [FormBuilder, RequestTaskStore, RequestTaskFileService],
  useFactory: (fb: FormBuilder, store: RequestTaskStore, fileService: RequestTaskFileService): FormGroup => {
    const requestTaskId = store.select(requestTaskQuery.selectRequestTaskId)();
    const requestTaskType = store.select(requestTaskQuery.selectRequestTaskType)();
    const isEditable = store.select(requestTaskQuery.selectIsEditable)();

    const doeAttachments = store.select(doeCommonQuery.selectAttachments)();
    const totalMaritimeEmissions = store.select(doeSubmitQuery.selectTotalMaritimeEmissions)();

    return fb.group({
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
            GovukValidators.integerNumber('Enter a whole number equal to or greater than 0'),
          ],
        },
      ),
      smallIslandFerryDeduction: fb.control<DoeTotalMaritimeEmissions['smallIslandFerryDeduction']>(
        totalMaritimeEmissions?.smallIslandFerryDeduction ?? null,
        {
          validators: [
            GovukValidators.required('Enter the small island ferry deduction'),
            GovukValidators.integerNumber('Enter a whole number equal to or greater than 0'),
          ],
        },
      ),
      iceClassDeduction: fb.control<DoeTotalMaritimeEmissions['iceClassDeduction']>(
        totalMaritimeEmissions?.iceClassDeduction ?? null,
        {
          validators: [
            GovukValidators.required('Enter the 5% ice class deduction'),
            GovukValidators.integerNumber('Enter a whole number equal to or greater than 0'),
          ],
        },
      ),
      surrenderEmissions: fb.control<DoeTotalMaritimeEmissions['surrenderEmissions']>(
        totalMaritimeEmissions?.surrenderEmissions ?? null,
        {
          validators: [
            GovukValidators.required('Enter the emissions figure for surrender'),
            GovukValidators.integerNumber('Enter a whole number equal to or greater than 0'),
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
    });
  },
};
