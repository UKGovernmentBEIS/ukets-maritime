import { ChangeDetectionStrategy, Component, computed, inject, Signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { EmpOperatorDetails, LimitedCompanyOrganisation } from '@mrtm/api';

import { TaskService } from '@netz/common/forms';
import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';

import { OPERATOR_DETAILS_SUB_TASK, OperatorDetailsWizardStep } from '@requests/common/components/operator-details';
import { empCommonQuery, empVariationReviewQuery } from '@requests/common/emp/+state';
import { EmpVariationReviewTaskPayload } from '@requests/common/emp/emp.types';
import { identifyMaritimeOperatorMap } from '@requests/common/emp/subtasks/subtask-list.map';
import { subtaskReviewGroupMap } from '@requests/common/emp/utils';
import { transformWizardStepDecision } from '@requests/common/emp/utils/transform-wizard-step-decision';
import {
  ReviewDecisionComponent,
  ReviewDecisionFormModel,
  reviewEmpSubtaskDecisionFormProvider,
  VARIATION_REVIEW_DECISION_FORM,
} from '@requests/tasks/emp-variation-review/components/review-decision';
import { EmpVariationReviewService } from '@requests/tasks/emp-variation-review/services';
import { OperatorDetailsSummaryTemplateComponent, WizardStepComponent } from '@shared/components';
import { AttachedFile, SubTaskListMap } from '@shared/types';

interface ViewModel {
  operatorDetails: EmpOperatorDetails;
  originalOperatorDetails: EmpOperatorDetails;
  operatorDetailsMap: SubTaskListMap<{
    operatorDetails: string;
    undertakenActivities: string;
    declarationDocuments: string;
    legalStatusOfOrganisation: string;
    organisationDetails: string;
    decision: string;
  }>;
  files: AttachedFile[];
  originalFiles: AttachedFile[];
  isEditable: boolean;
  wizardStep: { [s: string]: string };
}

@Component({
  selector: 'mrtm-operator-details-variation-review-decision',
  imports: [OperatorDetailsSummaryTemplateComponent, WizardStepComponent, ReviewDecisionComponent, ReactiveFormsModule],
  standalone: true,
  templateUrl: './operator-details-variation-review-decision.component.html',
  providers: [reviewEmpSubtaskDecisionFormProvider(OPERATOR_DETAILS_SUB_TASK)],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OperatorDetailsVariationReviewDecisionComponent {
  protected readonly form: ReviewDecisionFormModel = inject(VARIATION_REVIEW_DECISION_FORM);
  private readonly service: TaskService<EmpVariationReviewTaskPayload> = inject(
    TaskService<EmpVariationReviewTaskPayload>,
  );
  private readonly store: RequestTaskStore = inject(RequestTaskStore);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);

  readonly vm: Signal<ViewModel> = computed(() => {
    const empOperatorDetails = this.store.select(empCommonQuery.selectOperatorDetails)();
    const originalOperatorDetails = this.store.select(empVariationReviewQuery.selectOriginalOperatorDetails)();

    return {
      operatorDetails: empOperatorDetails,
      originalOperatorDetails: originalOperatorDetails,
      operatorDetailsMap: identifyMaritimeOperatorMap,
      files: this.store.select(
        empCommonQuery.selectAttachedFiles(
          (empOperatorDetails?.organisationStructure as LimitedCompanyOrganisation)?.evidenceFiles,
        ),
      )(),
      originalFiles: this.store.select(
        empVariationReviewQuery.selectOriginalAttachedFiles(
          (originalOperatorDetails?.organisationStructure as LimitedCompanyOrganisation)?.evidenceFiles,
        ),
      )(),
      isEditable: this.store.select(requestTaskQuery.selectIsEditable)(),
      wizardStep: transformWizardStepDecision(OperatorDetailsWizardStep),
    };
  });

  onSubmit() {
    (this.service as EmpVariationReviewService)
      .saveReviewDecision(
        OPERATOR_DETAILS_SUB_TASK,
        OperatorDetailsWizardStep.DECISION,
        this.route,
        this.form.value,
        subtaskReviewGroupMap[OPERATOR_DETAILS_SUB_TASK],
      )
      .subscribe();
  }
}
