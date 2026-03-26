import { Provider } from '@angular/core';
import { AbstractControl, FormBuilder, ValidationErrors, ValidatorFn } from '@angular/forms';

import { GuidanceSectionDTO, RegulatorCurrentUserDTO, SaveGuidanceSectionDTO } from '@mrtm/api';

import { AuthStore, selectUser } from '@netz/common/auth';
import { GovukValidators } from '@netz/govuk-components';

import { guidanceQuery, GuidanceStore } from '@guidance/+state';
import { MANAGE_GUIDANCE_FORM } from '@guidance/guidance.constants';
import { ManageSectionsFormGroupModel } from '@guidance/manage-sections/manage-sections-form/manage-sections-form.types';
import { isNil } from '@shared/utils';

const uniqueSectionNameValidator =
  (sections: Array<GuidanceSectionDTO>, currentSectionId?: number): ValidatorFn =>
  (control: AbstractControl): ValidationErrors => {
    if (
      !isNil(control.value) &&
      (sections ?? []).filter(
        (section) => section.id !== currentSectionId && section.name.toLowerCase() === control.value.toLowerCase(),
      ).length > 0
    ) {
      return { name: 'The section name you entered is already in use. Enter a unique section name' };
    }
    return null;
  };

export const manageSectionsFormProvider: Provider = {
  provide: MANAGE_GUIDANCE_FORM,
  deps: [FormBuilder, GuidanceStore, AuthStore],
  useFactory: (formBuilder: FormBuilder, store: GuidanceStore, authStore: AuthStore): ManageSectionsFormGroupModel => {
    const manageGuidance = store.select(guidanceQuery.selectManageGuidance)();
    const section = (manageGuidance?.object ??
      store.select(guidanceQuery.selectGuidanceSectionById(manageGuidance.sectionId))()) as SaveGuidanceSectionDTO;

    const availableSections = store.select(
      guidanceQuery.selectSectionsForCompetentAuthority(
        (authStore.select(selectUser)() as RegulatorCurrentUserDTO)?.competentAuthority,
      ),
    )();

    return formBuilder.group({
      name: formBuilder.control<SaveGuidanceSectionDTO['name'] | null>(section?.name, {
        validators: [
          GovukValidators.required('Enter the section name'),
          GovukValidators.maxLength(255, 'Section name should not be more than 255 characters'),
          uniqueSectionNameValidator(availableSections, manageGuidance?.sectionId),
        ],
        updateOn: 'change',
      }),
      displayOrderNo: formBuilder.control<SaveGuidanceSectionDTO['displayOrderNo'] | null>(section?.displayOrderNo),
    });
  },
};
