import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, OnInit, Signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { isNil } from 'lodash-es';

import { GuidanceSectionDTO, RegulatorCurrentUserDTO } from '@mrtm/api';

import { AuthStore, selectUser } from '@netz/common/auth';
import {
  ConditionalContentDirective,
  GovukSelectOption,
  LinkDirective,
  RadioComponent,
  RadioOptionComponent,
  SelectComponent,
} from '@netz/govuk-components';

import { guidanceQuery, GuidanceStore } from '@guidance/+state';
import { MANAGE_GUIDANCE_FORM } from '@guidance/guidance.constants';
import { manageSectionsTypeFormProvider } from '@guidance/manage-sections/manage-sections-type-form/manage-sections-type-form.provider';
import { ManageSectionsFromModel } from '@guidance/manage-sections/manage-sections-type-form/manage-sections-type-form.types';
import { WizardStepComponent } from '@shared/components';

@Component({
  selector: 'mrtm-manage-sections-type-form',
  standalone: true,
  imports: [
    WizardStepComponent,
    RadioComponent,
    RadioOptionComponent,
    ReactiveFormsModule,
    ConditionalContentDirective,
    NgTemplateOutlet,
    SelectComponent,
    LinkDirective,
    RouterLink,
  ],
  providers: [manageSectionsTypeFormProvider],
  templateUrl: './manage-sections-type-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManageSectionsTypeFormComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly guidanceStore = inject(GuidanceStore);
  private readonly authStore = inject(AuthStore);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);

  readonly formGroup: FormGroup = inject(MANAGE_GUIDANCE_FORM);
  readonly currentManageGuidance = this.guidanceStore.select(guidanceQuery.selectManageGuidance);
  readonly sections: Signal<Array<GovukSelectOption<GuidanceSectionDTO['id']>>> = computed(() => {
    const competentAuthority = (this.authStore.select(selectUser)() as RegulatorCurrentUserDTO)?.competentAuthority;

    return this.guidanceStore
      .select(guidanceQuery.selectSectionsForCompetentAuthority(competentAuthority))()
      .map((section) => ({
        value: section.id,
        text: section.name,
      }));
  });

  ngOnInit(): void {
    this.formGroup
      .get('type')
      .valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value: ManageSectionsFromModel['type']) => {
        if (value === 'CREATE') {
          this.formGroup.get('sectionId').disable();
        } else {
          this.formGroup.get('sectionId').enable();
        }
        this.formGroup.get('sectionId').setValue(null);
      });
  }

  onSubmit(): void {
    const { type, sectionId } = this.formGroup.value;
    const currentManageGuidance = this.currentManageGuidance();

    this.guidanceStore.updateManageGuidance({
      area: 'SECTIONS',
      type,
      sectionId: !isNil(sectionId) ? Number(sectionId) : null,
      object: currentManageGuidance?.type !== type ? null : currentManageGuidance?.object,
    });

    this.router.navigate([type.toLocaleLowerCase(), sectionId].filter(Boolean), { relativeTo: this.activatedRoute });
  }
}
