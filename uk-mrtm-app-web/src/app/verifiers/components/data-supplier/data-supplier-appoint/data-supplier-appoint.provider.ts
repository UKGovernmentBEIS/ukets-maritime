import { Provider } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AbstractControl, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { map } from 'rxjs';

import { GovukValidators } from '@netz/govuk-components';

import { APPOINT_DATA_SUPPLIER_FORM } from '@verifiers/components/data-supplier/data-supplier.constants';

export const provideDataSupplierAppointForm: Provider = {
  provide: APPOINT_DATA_SUPPLIER_FORM,
  deps: [FormBuilder, ActivatedRoute],
  useFactory: (formBuilder: FormBuilder, activatedRoute: ActivatedRoute) => {
    const dataSupplierId = toSignal(
      activatedRoute.queryParams.pipe(map((queryParams) => queryParams?.['dataSupplierId'])),
    );

    return formBuilder.group({
      dataSupplierId: formBuilder.control(dataSupplierId() ? Number(dataSupplierId()) : null, {
        validators: [
          GovukValidators.required('Select a data supplier'),
          GovukValidators.builder(
            'This data supplier is already appointed. Please select another one.',
            (control: AbstractControl) => (`${control.value}` === `${dataSupplierId()}` ? { duplicate: true } : null),
          ),
        ],
      }),
    });
  },
};
