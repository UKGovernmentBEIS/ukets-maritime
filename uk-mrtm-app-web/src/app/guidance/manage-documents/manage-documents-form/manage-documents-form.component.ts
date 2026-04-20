import { ChangeDetectionStrategy, Component, computed, inject, OnInit, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { isNil } from 'lodash-es';

import { GovukSelectOption, LinkDirective, SelectComponent, TextInputComponent } from '@netz/govuk-components';

import { guidanceQuery, GuidanceStore } from '@guidance/+state';
import { MANAGE_GUIDANCE_FORM } from '@guidance/guidance.constants';
import { ManageGuidanceDocumentDTO } from '@guidance/guidance.types';
import { manageDocumentsFormProvider } from '@guidance/manage-documents/manage-documents-form/manage-documents-form.provider';
import { ManageDocumentsFormGroupModel } from '@guidance/manage-documents/manage-documents-form/manage-documents-form.types';
import { FileInputComponent, WizardStepComponent } from '@shared/components';

@Component({
  selector: 'mrtm-manage-documents-form',
  standalone: true,
  imports: [
    WizardStepComponent,
    TextInputComponent,
    ReactiveFormsModule,
    LinkDirective,
    RouterLink,
    SelectComponent,
    FileInputComponent,
  ],
  providers: [manageDocumentsFormProvider],
  templateUrl: './manage-documents-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManageDocumentsFormComponent implements OnInit {
  private readonly guidanceStore = inject(GuidanceStore);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);

  readonly formGroup = inject<ManageDocumentsFormGroupModel>(MANAGE_GUIDANCE_FORM);
  readonly guidanceSectionId = toSignal(this.formGroup.get('sectionId').valueChanges, {
    initialValue: this.formGroup.get('sectionId').value,
  });
  readonly guidanceSection = computed(() =>
    this.guidanceStore.select(guidanceQuery.selectGuidanceSectionById(this.guidanceSectionId()))(),
  );
  readonly manageType = this.guidanceStore.select(guidanceQuery.selectManageGuidanceType);
  readonly displayOrderSelectItems: Signal<Array<GovukSelectOption>> = computed(() => {
    const manageType = this.guidanceStore.select(guidanceQuery.selectManageGuidanceType)();
    return [
      ...Array((this.guidanceSection()?.guidanceDocuments?.length ?? 0) + (manageType === 'CREATE' ? 1 : 0)).keys(),
    ].map((item) => ({ value: item + 1, text: `${item + 1}` }));
  });

  readonly getDownloadUrl: Signal<(uuid: string) => string | string[]> = computed(() => (uuid: string) => [
    `/guidance/${this.guidanceSectionId()}/download/`,
    uuid,
  ]);

  ngOnInit(): void {
    const displayOrderNoCtrl = this.formGroup.get('displayOrderNo');

    if (isNil(displayOrderNoCtrl.value)) {
      displayOrderNoCtrl.setValue(this.displayOrderSelectItems().at(-1).value);
    }
  }

  onSubmit(): void {
    const { file, ...documentDto } = this.formGroup.value;
    this.guidanceStore.updateManageGuidance({
      ...this.guidanceStore.select(guidanceQuery.selectManageGuidance)(),
      object: {
        ...documentDto,
        file,
      } as ManageGuidanceDocumentDTO,
    });

    this.router.navigate(['summary'], { relativeTo: this.activatedRoute });
  }
}
