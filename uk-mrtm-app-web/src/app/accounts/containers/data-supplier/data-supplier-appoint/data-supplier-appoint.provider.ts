import { Provider } from '@angular/core';
import { AbstractControl, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { GovukValidators } from '@netz/govuk-components';

import { APPOINT_DATA_SUPPLIER_FORM } from '@accounts/containers/data-supplier';

export const provideDataSupplierAppointForm: Provider = {
  provide: APPOINT_DATA_SUPPLIER_FORM,
  deps: [FormBuilder, ActivatedRoute],
  useFactory: (formBuilder: FormBuilder, activatedRoute: ActivatedRoute) => {
    const dataSupplierId = activatedRoute.snapshot.queryParams?.['dataSupplierId'];
    return formBuilder.group({
      dataSupplierId: formBuilder.control(dataSupplierId ? Number(dataSupplierId) : null, {
        validators: [
          GovukValidators.required('Select a data supplier'),
          GovukValidators.builder(
            'This data supplier is already appointed. Please select another one.',
            (control: AbstractControl) => (`${control.value}` === `${dataSupplierId}` ? { duplicate: true } : null),
          ),
        ],
      }),
    });
  },
};
