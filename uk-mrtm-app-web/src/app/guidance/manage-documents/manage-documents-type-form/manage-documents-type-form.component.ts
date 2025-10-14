import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, OnInit, Signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { isNil } from 'lodash-es';

import { GuidanceDocumentDTO, GuidanceSectionDTO, RegulatorCurrentUserDTO } from '@mrtm/api';

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
import { manageDocumentsTypeFormProvider } from '@guidance/manage-documents/manage-documents-type-form/manage-documents-type-form.provider';
import { WizardStepComponent } from '@shared/components';

@Component({
  selector: 'mrtm-manage-documents-type-form',
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
  providers: [manageDocumentsTypeFormProvider],
  templateUrl: './manage-documents-type-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManageDocumentsTypeFormComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly guidanceStore = inject(GuidanceStore);
  private readonly authStore = inject(AuthStore);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);

  readonly formGroup: FormGroup = inject(MANAGE_GUIDANCE_FORM);
  readonly currentManageGuidance = this.guidanceStore.select(guidanceQuery.selectManageGuidance);
  readonly selectedSectionId = toSignal(this.formGroup.get('sectionId').valueChanges, {
    initialValue: this.formGroup.get('sectionId').value,
  });
  readonly sections: Signal<Array<GovukSelectOption<GuidanceSectionDTO['id']>>> = computed(() => {
    const competentAuthority = (this.authStore.select(selectUser)() as RegulatorCurrentUserDTO)?.competentAuthority;

    return this.guidanceStore
      .select(guidanceQuery.selectSectionsForCompetentAuthority(competentAuthority))()
      .map((section) => ({
        value: section.id,
        text: section.name,
      }));
  });

  readonly documents: Signal<Array<GovukSelectOption<GuidanceDocumentDTO['id']>>> = computed(() => {
    return (
      this.guidanceStore.select(guidanceQuery.selectGuidanceSectionById(this.selectedSectionId()))()
        ?.guidanceDocuments ?? []
    ).map((document) => ({
      value: document.id,
      text: document.title,
    }));
  });

  ngOnInit(): void {
    this.formGroup
      .get('type')
      .valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        if (value === 'CREATE') {
          this.formGroup.get('documentId').disable();
        } else {
          this.formGroup.get('documentId').enable();
        }
        this.formGroup.get('sectionId').setValue(null);
        this.formGroup.get('documentId').setValue(null);
      });
  }

  onSubmit(): void {
    const { type, sectionId, documentId } = this.formGroup.value;
    const currentManageGuidance = this.currentManageGuidance();

    this.guidanceStore.updateManageGuidance({
      area: 'DOCUMENTS',
      type,
      sectionId: !isNil(sectionId) ? Number(sectionId) : null,
      documentId: !isNil(documentId) ? Number(documentId) : null,
      object: currentManageGuidance?.type !== type ? null : currentManageGuidance?.object,
    });

    this.router.navigate([type.toLocaleLowerCase(), documentId].filter(Boolean), { relativeTo: this.activatedRoute });
  }
}
