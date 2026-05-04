import { ChangeDetectionStrategy, Component, computed, inject, Signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { AdditionalDocuments } from '@mrtm/api';

import { TaskService } from '@netz/common/forms';
import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';

import { empCommonQuery, empVariationRegulatorQuery, EmpVariationRegulatorTaskPayload } from '@requests/common';
import { additionalDocumentsMap } from '@requests/common/emp/subtasks/subtask-list.map';
import { subtaskReviewGroupMap } from '@requests/common/emp/utils';
import { transformWizardStepDecision } from '@requests/common/emp/utils/transform-wizard-step-decision';
import {
  ADDITIONAL_DOCUMENTS_SUB_TASK,
  AdditionalDocumentsWizardStep,
} from '@requests/common/utils/additional-documents';
import {
  VARIATION_REGULATOR_DECISION_FORM,
  VariationRegulatorDecisionComponent,
  VariationRegulatorDecisionFormModel,
  variationRegulatorDecisionFormProvider,
} from '@requests/tasks/emp-variation-regulator/components';
import { EmpVariationRegulatorService } from '@requests/tasks/emp-variation-regulator/services';
import { AdditionalDocumentsSummaryTemplateComponent, WizardStepComponent } from '@shared/components';
import { AttachedFile, SubTaskListMap } from '@shared/types';

interface ViewModel {
  additionalDocuments: AdditionalDocuments;
  originalAdditionalDocuments: AdditionalDocuments;
  files: AttachedFile[];
  originalFiles: AttachedFile[];
  additionalDocumentsMap: SubTaskListMap<{
    additionalDocumentsUpload: string;
    variationRegulatorDecision: string;
    decision: string;
  }>;
  isEditable: boolean;
  wizardStep: { [s: string]: string };
}

@Component({
  selector: 'mrtm-additional-documents-variation-regulator-decision',
  imports: [
    AdditionalDocumentsSummaryTemplateComponent,
    WizardStepComponent,
    ReactiveFormsModule,
    VariationRegulatorDecisionComponent,
  ],
  standalone: true,
  templateUrl: './additional-documents-variation-regulator-decision.component.html',
  providers: [variationRegulatorDecisionFormProvider(ADDITIONAL_DOCUMENTS_SUB_TASK)],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdditionalDocumentsVariationRegulatorDecisionComponent {
  protected readonly form: VariationRegulatorDecisionFormModel = inject(VARIATION_REGULATOR_DECISION_FORM);
  private readonly service: TaskService<EmpVariationRegulatorTaskPayload> = inject(
    TaskService<EmpVariationRegulatorTaskPayload>,
  );
  private readonly store: RequestTaskStore = inject(RequestTaskStore);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);

  readonly vm: Signal<ViewModel> = computed(() => {
    const additionalDocuments = this.store.select(empCommonQuery.selectAdditionalDocuments)();
    const originalAdditionalDocuments = this.store.select(
      empVariationRegulatorQuery.selectOriginalAdditionalDocuments,
    )();
    return {
      additionalDocuments: additionalDocuments,
      originalAdditionalDocuments: originalAdditionalDocuments,
      files: this.store.select(empCommonQuery.selectAttachedFiles(additionalDocuments?.documents))(),
      originalFiles: this.store.select(
        empVariationRegulatorQuery.selectOriginalAttachedFiles(originalAdditionalDocuments?.documents),
      )(),
      additionalDocumentsMap: additionalDocumentsMap,
      isEditable: this.store.select(requestTaskQuery.selectIsEditable)(),
      wizardStep: transformWizardStepDecision(AdditionalDocumentsWizardStep),
    };
  });

  onSubmit() {
    (this.service as EmpVariationRegulatorService)
      .saveVariationRegulatorDecision(
        ADDITIONAL_DOCUMENTS_SUB_TASK,
        AdditionalDocumentsWizardStep.VARIATION_REGULATOR_DECISION,
        this.route,
        this.form.value,
        subtaskReviewGroupMap[ADDITIONAL_DOCUMENTS_SUB_TASK],
      )
      .subscribe();
  }
}
