import { ChangeDetectionStrategy, Component, computed, inject, Signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { AdditionalDocuments } from '@mrtm/api';

import { TaskService } from '@netz/common/forms';
import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';

import { empCommonQuery, empVariationReviewQuery } from '@requests/common/emp/+state';
import { EmpVariationReviewTaskPayload } from '@requests/common/emp/emp.types';
import { additionalDocumentsMap } from '@requests/common/emp/subtasks/subtask-list.map';
import { subtaskReviewGroupMap } from '@requests/common/emp/utils';
import { transformWizardStepDecision } from '@requests/common/emp/utils/transform-wizard-step-decision';
import {
  ADDITIONAL_DOCUMENTS_SUB_TASK,
  AdditionalDocumentsWizardStep,
} from '@requests/common/utils/additional-documents';
import {
  ReviewDecisionComponent,
  ReviewDecisionFormModel,
  reviewEmpSubtaskDecisionFormProvider,
  VARIATION_REVIEW_DECISION_FORM,
} from '@requests/tasks/emp-variation-review/components/review-decision';
import { EmpVariationReviewService } from '@requests/tasks/emp-variation-review/services';
import { AdditionalDocumentsSummaryTemplateComponent, WizardStepComponent } from '@shared/components';
import { AttachedFile, SubTaskListMap } from '@shared/types';

interface ViewModel {
  additionalDocuments: AdditionalDocuments;
  originalAdditionalDocuments: AdditionalDocuments;
  files: AttachedFile[];
  originalFiles: AttachedFile[];
  additionalDocumentsMap: SubTaskListMap<{ additionalDocumentsUpload: string; decision: string }>;
  isEditable: boolean;
  wizardStep: { [s: string]: string };
}

@Component({
  selector: 'mrtm-additional-documents-variation-review-decision',
  standalone: true,
  imports: [
    AdditionalDocumentsSummaryTemplateComponent,
    ReviewDecisionComponent,
    WizardStepComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './additional-documents-variation-review-decision.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [reviewEmpSubtaskDecisionFormProvider(ADDITIONAL_DOCUMENTS_SUB_TASK)],
})
export class AdditionalDocumentsVariationReviewDecisionComponent {
  protected readonly form: ReviewDecisionFormModel = inject(VARIATION_REVIEW_DECISION_FORM);
  private readonly service: TaskService<EmpVariationReviewTaskPayload> = inject(
    TaskService<EmpVariationReviewTaskPayload>,
  );
  private readonly store: RequestTaskStore = inject(RequestTaskStore);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);

  vm: Signal<ViewModel> = computed(() => {
    const additionalDocuments = this.store.select(empCommonQuery.selectAdditionalDocuments)();
    const originalAdditionalDocuments = this.store.select(empVariationReviewQuery.selectOriginalAdditionalDocuments)();
    return {
      additionalDocuments: additionalDocuments,
      originalAdditionalDocuments: originalAdditionalDocuments,
      files: this.store.select(empCommonQuery.selectAttachedFiles(additionalDocuments?.documents))(),
      originalFiles: this.store.select(
        empVariationReviewQuery.selectOriginalAttachedFiles(originalAdditionalDocuments?.documents),
      )(),
      additionalDocumentsMap: additionalDocumentsMap,
      isEditable: this.store.select(requestTaskQuery.selectIsEditable)(),
      wizardStep: transformWizardStepDecision(AdditionalDocumentsWizardStep),
    };
  });

  onSubmit() {
    (this.service as EmpVariationReviewService)
      .saveReviewDecision(
        ADDITIONAL_DOCUMENTS_SUB_TASK,
        AdditionalDocumentsWizardStep.DECISION,
        this.route,
        this.form.value,
        subtaskReviewGroupMap[ADDITIONAL_DOCUMENTS_SUB_TASK],
      )
      .subscribe();
  }
}
