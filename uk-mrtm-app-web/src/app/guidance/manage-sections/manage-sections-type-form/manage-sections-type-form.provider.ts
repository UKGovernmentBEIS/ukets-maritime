import { Provider } from '@angular/core';
import { AbstractControl, FormBuilder, ValidatorFn } from '@angular/forms';

import { GovukValidators } from '@netz/govuk-components';

import { guidanceQuery, GuidanceStore } from '@guidance/+state';
import { MANAGE_GUIDANCE_FORM } from '@guidance/guidance.constants';
import {
  ManageSectionsFormGroupModel,
  ManageSectionsFromModel,
} from '@guidance/manage-sections/manage-sections-type-form/manage-sections-type-form.types';
import { isNil } from '@shared/utils';

const noFilesAttachedToSectionValidator =
  (store: GuidanceStore): ValidatorFn =>
  (control: AbstractControl) => {
    if (control.value?.type !== 'DELETE' || isNil(control.value?.sectionId)) {
      return null;
    }
    const section = store.select(guidanceQuery.selectGuidanceSectionById(control.value.sectionId))();
    return section?.guidanceDocuments?.length
      ? {
          sectionWithFiles:
            'There are still files remaining in this section. You must delete all files before you can delete the section.',
        }
      : null;
  };

const selectedSectionRequired = (formGroup: ManageSectionsFormGroupModel): ValidatorFn => {
  return (control: AbstractControl) => {
    const currentType = formGroup.get('type').value;
    const valid =
      isNil(currentType) || currentType === 'CREATE' || (!isNil(control.value) && `${control.value}`.trim().length);

    const message = currentType === 'UPDATE' ? 'Select the section to be updated' : 'Select the section to be deleted';

    return valid
      ? null
      : {
          required: message,
        };
  };
};

export const manageSectionsTypeFormProvider: Provider = {
  provide: MANAGE_GUIDANCE_FORM,
  deps: [FormBuilder, GuidanceStore],
  useFactory: (formBuilder: FormBuilder, store: GuidanceStore): ManageSectionsFormGroupModel => {
    const manageGuidance = store.select(guidanceQuery.selectManageGuidance)();

    const formGroup = formBuilder.group(
      {
        type: formBuilder.control<ManageSectionsFromModel['type'] | null>(manageGuidance?.type ?? null, {
          validators: [GovukValidators.required('Select the type of update you want to make')],
        }),
        sectionId: formBuilder.control<ManageSectionsFromModel['sectionId'] | null>({
          value: manageGuidance?.sectionId,
          disabled: isNil(manageGuidance?.type) || manageGuidance?.type === 'CREATE',
        }),
      },
      {
        validators: [noFilesAttachedToSectionValidator(store)],
      },
    );

    formGroup.get('sectionId').setValidators(selectedSectionRequired(formGroup));

    return formGroup;
  },
};
