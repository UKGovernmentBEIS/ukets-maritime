import { Provider } from '@angular/core';
import { AbstractControl, FormBuilder, ValidatorFn } from '@angular/forms';

import { isNil } from 'lodash-es';

import { GovukValidators } from '@netz/govuk-components';

import { guidanceQuery, GuidanceStore } from '@guidance/+state';
import { MANAGE_GUIDANCE_FORM } from '@guidance/guidance.constants';
import {
  ManageDocumentsFormGroupModel,
  ManageDocumentsFromModel,
} from '@guidance/manage-documents/manage-documents-type-form/manage-documents-type-form.types';

const sectionRequiredValidator = (formGroup: ManageDocumentsFormGroupModel): ValidatorFn => {
  return (control: AbstractControl) => {
    const currentType = formGroup.get('type').value;
    const valid = isNil(currentType) || (!isNil(control.value) && `${control.value}`.trim().length);

    const message =
      currentType === 'CREATE'
        ? 'Select the section the file will be added to'
        : currentType === 'UPDATE'
          ? 'Select the section that contains the file to be updated'
          : 'Select the section that contains the file to be deleted';

    return valid
      ? null
      : {
          required: message,
        };
  };
};

const documentRequired = (formGroup: ManageDocumentsFormGroupModel): ValidatorFn => {
  return (control: AbstractControl) => {
    const currentType = formGroup.get('type').value;
    const valid =
      isNil(currentType) || currentType === 'CREATE' || (!isNil(control.value) && `${control.value}`.trim().length);

    const message = currentType === 'UPDATE' ? 'Select the file to be updated' : 'Select the file to be deleted';

    return valid
      ? null
      : {
          required: message,
        };
  };
};

export const manageDocumentsTypeFormProvider: Provider = {
  provide: MANAGE_GUIDANCE_FORM,
  deps: [FormBuilder, GuidanceStore],
  useFactory: (formBuilder: FormBuilder, store: GuidanceStore): ManageDocumentsFormGroupModel => {
    const manageGuidance = store.select(guidanceQuery.selectManageGuidance)();

    const formGroup = formBuilder.group({
      type: formBuilder.control<ManageDocumentsFromModel['type'] | null>(manageGuidance?.type ?? null, {
        validators: [GovukValidators.required('Select the type of update you want to make')],
      }),
      sectionId: formBuilder.control<ManageDocumentsFromModel['sectionId'] | null>(manageGuidance?.sectionId),
      documentId: formBuilder.control<ManageDocumentsFromModel['documentId'] | null>({
        value: manageGuidance?.sectionId,
        disabled: isNil(manageGuidance?.type) || manageGuidance?.type === 'CREATE',
      }),
    });

    formGroup.get('sectionId').setValidators([sectionRequiredValidator(formGroup)]);
    formGroup.get('documentId').setValidators([documentRequired(formGroup)]);
    return formGroup;
  },
};
