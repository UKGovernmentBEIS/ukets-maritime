import { FormControl } from '@angular/forms';

import { EmpProcedureForm } from '@mrtm/api';

import { GovukValidators } from '@netz/govuk-components';

export const getEmpProcedureFormGroup = (formData?: EmpProcedureForm): Record<keyof EmpProcedureForm, FormControl> => ({
  reference: new FormControl<EmpProcedureForm['reference'] | null>(formData?.reference, {
    validators: [
      GovukValidators.required('Enter a procedure reference'),
      GovukValidators.maxLength(250, 'Enter up to 250 characters'),
    ],
  }),
  version: new FormControl<EmpProcedureForm['version'] | null>(formData?.version, {
    validators: [GovukValidators.maxLength(250, 'Enter up to 250 characters')],
  }),
  description: new FormControl<EmpProcedureForm['description'] | null>(formData?.description, {
    validators: [
      GovukValidators.required('Enter a description for the procedure'),
      GovukValidators.maxLength(10000, 'Enter up to 10000 characters'),
    ],
  }),
  responsiblePersonOrPosition: new FormControl<EmpProcedureForm['responsiblePersonOrPosition'] | null>(
    formData?.responsiblePersonOrPosition,
    {
      validators: [
        GovukValidators.required('Enter the name of the person or position responsible for this procedure'),
        GovukValidators.maxLength(250, 'Enter up to 250 characters'),
      ],
    },
  ),
  recordsLocation: new FormControl<EmpProcedureForm['recordsLocation'] | null>(formData?.recordsLocation, {
    validators: [
      GovukValidators.required('Enter the location where records are kept'),
      GovukValidators.maxLength(250, 'Enter up to 250 characters'),
    ],
  }),
  itSystemUsed: new FormControl<EmpProcedureForm['itSystemUsed'] | null>(formData?.itSystemUsed, {
    validators: [GovukValidators.maxLength(250, 'Enter up to 250 characters')],
  }),
});
