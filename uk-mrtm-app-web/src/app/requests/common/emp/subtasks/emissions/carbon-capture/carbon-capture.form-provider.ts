import { Provider } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';
import { GovukValidators } from '@netz/govuk-components';

import { empCommonQuery } from '@requests/common/emp/+state';
import {
  CarbonCaptureFormModel,
  EmpCarbonCaptureTechnologiesFormModel,
} from '@requests/common/emp/subtasks/emissions/carbon-capture/carbon-capture.types';
import { TASK_FORM } from '@requests/common/task-form.token';
import { taskActionTypeToUploadSectionTaskActionTypeMap } from '@shared/constants/upload-attachment-request-task-action-type.map';
import { RequestTaskFileService } from '@shared/services';

export const carbonCaptureFormProvider: Provider = {
  provide: TASK_FORM,
  deps: [FormBuilder, RequestTaskStore, ActivatedRoute, RequestTaskFileService],
  useFactory: (
    fb: FormBuilder,
    store: RequestTaskStore,
    activatedRoute: ActivatedRoute,
    fileService: RequestTaskFileService,
  ) => {
    const empAttachments = store.select(empCommonQuery.selectEmpAttachments)();
    const isEditable = store.select(requestTaskQuery.selectIsEditable)();
    const requestTaskId = store.select(requestTaskQuery.selectRequestTaskId)();
    const shipId = activatedRoute.snapshot.params.shipId;
    const carbonCapture = store.select(empCommonQuery.selectShipCarbonCapture(shipId))();
    const requestTaskType = store.select(requestTaskQuery.selectRequestTaskType)();

    return fb.group<CarbonCaptureFormModel>({
      carbonCapture: fb.group({
        exist: fb.control<boolean | null>(carbonCapture?.exist ?? null, {
          validators: [
            GovukValidators.required('Select yes if carbon capture and storage technologies are being applied'),
          ],
        }),
        technologies: fb.group<EmpCarbonCaptureTechnologiesFormModel>({
          description: fb.control<string | null>(carbonCapture?.technologies?.description ?? null, {
            validators: [
              GovukValidators.required(
                'Enter a description of the technology that is used for carbon capture and storage',
              ),
              GovukValidators.maxLength(10000, 'Enter up to 10000 characters'),
            ],
          }),
          files: fileService.buildFormControl(
            requestTaskId,
            carbonCapture?.technologies?.files ?? [],
            empAttachments,
            taskActionTypeToUploadSectionTaskActionTypeMap?.[requestTaskType],
            false,
            !isEditable,
          ),
          technologyEmissionSources: fb.control<string[] | null>(
            carbonCapture?.technologies?.technologyEmissionSources ?? null,
            {
              validators: [GovukValidators.required('Select the emission source this technology is applied to')],
            },
          ),
        }),
      }),
    });
  },
};
