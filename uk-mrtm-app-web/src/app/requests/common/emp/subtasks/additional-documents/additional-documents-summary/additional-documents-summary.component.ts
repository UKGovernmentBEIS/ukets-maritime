import { ChangeDetectionStrategy, Component, computed, inject, Signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AdditionalDocuments, EmpAcceptedVariationDecisionDetails } from '@mrtm/api';

import { PageHeadingComponent, ReturnToTaskOrActionPageComponent } from '@netz/common/components';
import { PendingButtonDirective } from '@netz/common/directives';
import { TaskService } from '@netz/common/forms';
import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';
import { ButtonDirective } from '@netz/govuk-components';

import {
  empCommonQuery,
  empReviewQuery,
  empVariationRegulatorQuery,
  empVariationReviewQuery,
} from '@requests/common/emp/+state';
import { EmpTaskPayload } from '@requests/common/emp/emp.types';
import { additionalDocumentsMap } from '@requests/common/emp/subtasks/subtask-list.map';
import {
  ADDITIONAL_DOCUMENTS_SUB_TASK,
  AdditionalDocumentsWizardStep,
} from '@requests/common/utils/additional-documents';
import {
  AdditionalDocumentsSummaryTemplateComponent,
  EmpReviewDecisionSummaryTemplateComponent,
} from '@shared/components';
import { VariationRegulatorDecisionPartialSummaryTemplateComponent } from '@shared/components/summaries/variation-regulator-decision-partial-summary-template';
import { AttachedFile, EmpVariationReviewDecisionDto, SubTaskListMap } from '@shared/types';

interface ViewModel {
  additionalDocuments: AdditionalDocuments;
  originalAdditionalDocuments: AdditionalDocuments;
  files: AttachedFile[];
  originalFiles: AttachedFile[];
  isVariationRegulatorDecision: boolean;
  variationDecisionDetails: EmpAcceptedVariationDecisionDetails;
  hasReview: boolean;
  empReviewDecisionDTO: EmpVariationReviewDecisionDto;
  additionalDocumentsMap: SubTaskListMap<{ additionalDocumentsUpload: string }>;
  isEditable: boolean;
  isSubTaskCompleted: boolean;
  wizardStep: { [s: string]: string };
}

@Component({
  selector: 'mrtm-additional-documents-summary',
  standalone: true,
  imports: [
    PageHeadingComponent,
    AdditionalDocumentsSummaryTemplateComponent,
    PendingButtonDirective,
    ButtonDirective,
    ReturnToTaskOrActionPageComponent,
    VariationRegulatorDecisionPartialSummaryTemplateComponent,
    EmpReviewDecisionSummaryTemplateComponent,
  ],
  templateUrl: './additional-documents-summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdditionalDocumentsSummaryComponent {
  private readonly service: TaskService<EmpTaskPayload> = inject(TaskService<EmpTaskPayload>);
  private readonly store: RequestTaskStore = inject(RequestTaskStore);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);

  vm: Signal<ViewModel> = computed(() => {
    const additionalDocuments = this.store.select(empCommonQuery.selectAdditionalDocuments)();
    const originalAdditionalDocuments = this.store.select(
      empVariationRegulatorQuery.selectOriginalAdditionalDocuments,
    )();
    const hasReview = this.store.select(empCommonQuery.selectHasReview)();
    const isEditable = this.store.select(empCommonQuery.selectIsPeerReview)()
      ? false
      : this.store.select(requestTaskQuery.selectIsEditable)();
    const isSubTaskCompleted = hasReview
      ? this.store.select(empReviewQuery.selectIsSubtaskCompleted(ADDITIONAL_DOCUMENTS_SUB_TASK))()
      : this.store.select(empCommonQuery.selectIsSubtaskCompleted(ADDITIONAL_DOCUMENTS_SUB_TASK))();

    return {
      additionalDocuments: additionalDocuments,
      originalAdditionalDocuments: originalAdditionalDocuments,
      files: this.store.select(empCommonQuery.selectAttachedFiles(additionalDocuments?.documents))(),
      originalFiles: this.store.select(
        empVariationRegulatorQuery.selectOriginalAttachedFiles(originalAdditionalDocuments?.documents),
      )(),
      variationDecisionDetails: this.store.select(
        empVariationRegulatorQuery.selectSubtaskVariationDecisionDetails(ADDITIONAL_DOCUMENTS_SUB_TASK),
      )(),
      isVariationRegulatorDecision: this.store.select(empCommonQuery.selectIsVariationRegulator)(),
      hasReview: hasReview,
      empReviewDecisionDTO: this.store.select(
        empVariationReviewQuery.selectEmpReviewDecisionDTO(ADDITIONAL_DOCUMENTS_SUB_TASK),
      )(),
      additionalDocumentsMap: additionalDocumentsMap,
      isEditable: isEditable,
      isSubTaskCompleted: isSubTaskCompleted,
      wizardStep: AdditionalDocumentsWizardStep,
    };
  });

  onSubmit() {
    this.service
      .submitSubtask(ADDITIONAL_DOCUMENTS_SUB_TASK, AdditionalDocumentsWizardStep.SUMMARY, this.route)
      .subscribe();
  }
}
