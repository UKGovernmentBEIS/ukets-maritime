import { Provider } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

import { ThirdPartyDataProviderCreateDTO } from '@mrtm/api';

import { GovukValidators } from '@netz/govuk-components';

import { dataSuppliersQuery, DataSuppliersStore } from '@data-suppliers/+state';
import { DATA_SUPPLIER_FORM } from '@data-suppliers/data-suppliers.constants';
import { DataSupplierItem } from '@data-suppliers/data-suppliers.types';
import { DataSuppliersFormGroup } from '@data-suppliers/data-suppliers-form/data-suppliers-form.types';

const dataSupplierValueExistExistValidator =
  (items: Array<DataSupplierItem>, key: keyof ThirdPartyDataProviderCreateDTO, message: string): ValidatorFn =>
  (control: AbstractControl): ValidationErrors | null => {
    const values = items.map((item) => item[key].toLowerCase());

    return values.includes(control.value?.toLowerCase())
      ? {
          exist: message,
        }
      : null;
  };

export const provideDataSuppliersForm: Provider = {
  provide: DATA_SUPPLIER_FORM,
  deps: [FormBuilder, DataSuppliersStore],
  useFactory: (formBuilder: FormBuilder, store: DataSuppliersStore): FormGroup<DataSuppliersFormGroup> => {
    const dataSuppliers = store.select(dataSuppliersQuery.selectItems)();
    const newItem = store.select(dataSuppliersQuery.selectNewItem)();

    return formBuilder.group({
      name: formBuilder.control<ThirdPartyDataProviderCreateDTO['name'] | null>(newItem?.name, {
        validators: [
          GovukValidators.required('Enter the name of the data supplier'),
          GovukValidators.maxLength(255, 'Enter up to 255 characters'),
          dataSupplierValueExistExistValidator(
            dataSuppliers,
            'name',
            'The name of the data supplier already exists. Enter a unique name.',
          ),
        ],
      }),
    });
  },
};
