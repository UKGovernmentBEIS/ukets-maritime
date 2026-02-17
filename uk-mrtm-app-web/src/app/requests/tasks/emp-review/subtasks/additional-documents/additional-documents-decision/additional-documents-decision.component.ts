import { ChangeDetectionStrategy, Component, computed, inject, Signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { AdditionalDocuments } from '@mrtm/api';

import { TaskService } from '@netz/common/forms';
import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';

import { empCommonQuery, EmpReviewTaskPayload } from '@requests/common';
import { additionalDocumentsMap } from '@requests/common/emp/subtasks/subtask-list.map';
import { subtaskReviewGroupMap } from '@requests/common/emp/utils';
import { transformWizardStepDecision } from '@requests/common/emp/utils/transform-wizard-step-decision';
import {
  ADDITIONAL_DOCUMENTS_SUB_TASK,
  AdditionalDocumentsWizardStep,
} from '@requests/common/utils/additional-documents';
import {
  REVIEW_DECISION_FORM,
  ReviewDecisionComponent,
  ReviewDecisionFormModel,
  reviewDecisionFormProvider,
} from '@requests/tasks/emp-review/components/review-decision';
import { EmpReviewService } from '@requests/tasks/emp-review/services';
import { AdditionalDocumentsSummaryTemplateComponent, WizardStepComponent } from '@shared/components';
import { AttachedFile, SubTaskListMap } from '@shared/types';

interface ViewModel {
  additionalDocuments: AdditionalDocuments;
  additionalDocumentsMap: SubTaskListMap<{ additionalDocumentsUpload: string; decision: string }>;
  files: AttachedFile[];
  isEditable: boolean;
  wizardStep: { [s: string]: string };
}

@Component({
  selector: 'mrtm-additional-documents-decision',
  imports: [
    AdditionalDocumentsSummaryTemplateComponent,
    ReviewDecisionComponent,
    WizardStepComponent,
    ReactiveFormsModule,
  ],
  standalone: true,
  templateUrl: './additional-documents-decision.component.html',
  providers: [reviewDecisionFormProvider(ADDITIONAL_DOCUMENTS_SUB_TASK)],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdditionalDocumentsDecisionComponent {
  protected readonly form: ReviewDecisionFormModel = inject(REVIEW_DECISION_FORM);
  private readonly service: TaskService<EmpReviewTaskPayload> = inject(TaskService<EmpReviewTaskPayload>);
  private readonly store: RequestTaskStore = inject(RequestTaskStore);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);

  readonly vm: Signal<ViewModel> = computed(() => {
    const additionalDocuments = this.store.select(empCommonQuery.selectAdditionalDocuments)();
    return {
      additionalDocuments: additionalDocuments,
      additionalDocumentsMap: additionalDocumentsMap,
      files: this.store.select(empCommonQuery.selectAttachedFiles(additionalDocuments?.documents))(),
      isEditable: this.store.select(requestTaskQuery.selectIsEditable)(),
      wizardStep: transformWizardStepDecision(AdditionalDocumentsWizardStep),
    };
  });

  onSubmit() {
    (this.service as EmpReviewService)
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
