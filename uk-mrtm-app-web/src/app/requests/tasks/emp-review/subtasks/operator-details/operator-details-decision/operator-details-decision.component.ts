import { ChangeDetectionStrategy, Component, computed, inject, Signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { EmpOperatorDetails, LimitedCompanyOrganisation } from '@mrtm/api';

import { TaskService } from '@netz/common/forms';
import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';

import { empCommonQuery, EmpReviewTaskPayload } from '@requests/common';
import { OPERATOR_DETAILS_SUB_TASK, OperatorDetailsWizardStep } from '@requests/common/components/operator-details';
import { identifyMaritimeOperatorMap } from '@requests/common/emp/subtasks/subtask-list.map';
import { subtaskReviewGroupMap } from '@requests/common/emp/utils';
import { transformWizardStepDecision } from '@requests/common/emp/utils/transform-wizard-step-decision';
import {
  REVIEW_DECISION_FORM,
  ReviewDecisionComponent,
  ReviewDecisionFormModel,
  reviewDecisionFormProvider,
} from '@requests/tasks/emp-review/components/review-decision';
import { EmpReviewService } from '@requests/tasks/emp-review/services';
import { OperatorDetailsSummaryTemplateComponent, WizardStepComponent } from '@shared/components';
import { AttachedFile, SubTaskListMap } from '@shared/types';

interface ViewModel {
  operatorDetails: EmpOperatorDetails;
  operatorDetailsMap: SubTaskListMap<{
    operatorDetails: string;
    undertakenActivities: string;
    declarationDocuments: string;
    legalStatusOfOrganisation: string;
    organisationDetails: string;
    decision: string;
  }>;
  files: AttachedFile[];
  isEditable: boolean;
  wizardStep: { [s: string]: string };
}

@Component({
  selector: 'mrtm-operator-details-decision',
  standalone: true,
  imports: [OperatorDetailsSummaryTemplateComponent, WizardStepComponent, ReviewDecisionComponent, ReactiveFormsModule],
  templateUrl: './operator-details-decision.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [reviewDecisionFormProvider(OPERATOR_DETAILS_SUB_TASK)],
})
export class OperatorDetailsDecisionComponent {
  protected readonly form: ReviewDecisionFormModel = inject(REVIEW_DECISION_FORM);
  private readonly service: TaskService<EmpReviewTaskPayload> = inject(TaskService<EmpReviewTaskPayload>);
  private readonly store: RequestTaskStore = inject(RequestTaskStore);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);

  vm: Signal<ViewModel> = computed(() => {
    const empOperatorDetails = this.store.select(empCommonQuery.selectOperatorDetails)();

    return {
      operatorDetails: empOperatorDetails,
      operatorDetailsMap: identifyMaritimeOperatorMap,
      files: this.store.select(
        empCommonQuery.selectAttachedFiles(
          (empOperatorDetails?.organisationStructure as LimitedCompanyOrganisation)?.evidenceFiles,
        ),
      )(),
      isEditable: this.store.select(requestTaskQuery.selectIsEditable)(),
      wizardStep: transformWizardStepDecision(OperatorDetailsWizardStep),
    };
  });

  onSubmit() {
    (this.service as EmpReviewService)
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
