import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { EmpProcedureForm } from '@mrtm/api';

import { RequestTaskState, RequestTaskStore, StateSelector } from '@netz/common/store';

import { getEmpProcedureFormGroup } from '@requests/common/emp/components';

export const empProcedureFormProviderFactory = <T>(
  area: keyof T,
  formBuilder: FormBuilder,
  store: RequestTaskStore,
  selector: StateSelector<RequestTaskState, T>,
): FormGroup<Record<keyof EmpProcedureForm, FormControl>> => {
  const formData: EmpProcedureForm = store.select(selector)()?.[area] as EmpProcedureForm;

  return formBuilder.group(getEmpProcedureFormGroup(formData));
};
