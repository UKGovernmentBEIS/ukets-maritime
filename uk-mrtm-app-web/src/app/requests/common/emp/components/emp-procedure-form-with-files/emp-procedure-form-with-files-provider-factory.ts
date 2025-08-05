import { inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { EmpProcedureForm, EmpProcedureFormWithFiles } from '@mrtm/api';

import { requestTaskQuery, RequestTaskState, RequestTaskStore, StateSelector } from '@netz/common/store';

import { empCommonQuery } from '@requests/common/emp/+state';
import { getEmpProcedureFormGroup } from '@requests/common/emp/components';
import { taskActionTypeToUploadSectionTaskActionTypeMap } from '@shared/constants/upload-attachment-request-task-action-type.map';
import { RequestTaskFileService } from '@shared/services';

export const empProcedureFormWithFilesProviderFactory = <T>(
  area: keyof T,
  formBuilder: FormBuilder,
  store: RequestTaskStore,
  selector: StateSelector<RequestTaskState, T>,
): FormGroup<Record<keyof EmpProcedureFormWithFiles, FormControl>> => {
  const formData = store.select(selector)()?.[area] as EmpProcedureFormWithFiles;
  const fileService = inject(RequestTaskFileService);
  const requestTaskId = store.select(requestTaskQuery.selectRequestTaskId)();
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();
  const empAttachments = store.select(empCommonQuery.selectEmpAttachments)();
  const requestTaskType = store.select(requestTaskQuery.selectRequestTaskType)();

  return formBuilder.group({
    ...getEmpProcedureFormGroup(formData as EmpProcedureForm),
    files: fileService.buildFormControl(
      requestTaskId,
      formData?.files ?? [],
      empAttachments,
      taskActionTypeToUploadSectionTaskActionTypeMap?.[requestTaskType],
      false,
      !isEditable,
    ),
  });
};
