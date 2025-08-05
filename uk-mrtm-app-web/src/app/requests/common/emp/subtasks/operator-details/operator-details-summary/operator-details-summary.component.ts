import { ChangeDetectionStrategy, Component, computed, inject, Signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { EmpAcceptedVariationDecisionDetails, EmpOperatorDetails, LimitedCompanyOrganisation } from '@mrtm/api';

import { PageHeadingComponent, ReturnToTaskOrActionPageComponent } from '@netz/common/components';
import { PendingButtonDirective } from '@netz/common/directives';
import { TaskService } from '@netz/common/forms';
import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';
import { ButtonDirective } from '@netz/govuk-components';

import { OPERATOR_DETAILS_SUB_TASK, OperatorDetailsWizardStep } from '@requests/common/components/operator-details';
import {
  empCommonQuery,
  empReviewQuery,
  empVariationRegulatorQuery,
  empVariationReviewQuery,
} from '@requests/common/emp/+state';
import { EmpCommonTaskPayload } from '@requests/common/emp/emp.types';
import { identifyMaritimeOperatorMap } from '@requests/common/emp/subtasks/subtask-list.map';
import { EmpReviewDecisionSummaryTemplateComponent, OperatorDetailsSummaryTemplateComponent } from '@shared/components';
import { VariationRegulatorDecisionPartialSummaryTemplateComponent } from '@shared/components/summaries/variation-regulator-decision-partial-summary-template';
import { AttachedFile, EmpVariationReviewDecisionDto, SubTaskListMap } from '@shared/types';

interface ViewModel {
  operatorDetails: EmpOperatorDetails;
  originalOperatorDetails: EmpOperatorDetails;
  files: AttachedFile[];
  originalFiles: AttachedFile[];
  declarationFiles: AttachedFile[];
  originalDeclarationFiles: AttachedFile[];
  isVariationRegulatorDecision: boolean;
  variationDecisionDetails: EmpAcceptedVariationDecisionDetails;
  hasReview: boolean;
  empReviewDecisionDTO: EmpVariationReviewDecisionDto;
  operatorDetailsMap: SubTaskListMap<{ operatorDetails: string }>;
  isEditable: boolean;
  isSubTaskCompleted: boolean;
  wizardStep: { [s: string]: string };
}

@Component({
  selector: 'mrtm-operator-details-summary',
  standalone: true,
  imports: [
    PageHeadingComponent,
    OperatorDetailsSummaryTemplateComponent,
    PendingButtonDirective,
    ButtonDirective,
    ReturnToTaskOrActionPageComponent,
    VariationRegulatorDecisionPartialSummaryTemplateComponent,
    EmpReviewDecisionSummaryTemplateComponent,
  ],
  templateUrl: './operator-details-summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OperatorDetailsSummaryComponent {
  private readonly service: TaskService<EmpCommonTaskPayload> = inject(TaskService<EmpCommonTaskPayload>);
  private readonly store: RequestTaskStore = inject(RequestTaskStore);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);

  vm: Signal<ViewModel> = computed(() => {
    const empOperatorDetails = this.store.select(empCommonQuery.selectOperatorDetails)();
    const originalOperatorDetails = this.store.select(empVariationRegulatorQuery.selectOriginalOperatorDetails)();
    const hasReview = this.store.select(empCommonQuery.selectHasReview)();
    const isEditable = this.store.select(empCommonQuery.selectIsPeerReview)()
      ? false
      : this.store.select(requestTaskQuery.selectIsEditable)();
    const isSubTaskCompleted = hasReview
      ? this.store.select(empReviewQuery.selectIsSubtaskCompleted(OPERATOR_DETAILS_SUB_TASK))()
      : this.store.select(empCommonQuery.selectIsSubtaskCompleted(OPERATOR_DETAILS_SUB_TASK))();

    return {
      operatorDetails: empOperatorDetails,
      originalOperatorDetails: originalOperatorDetails,
      files: this.store.select(
        empCommonQuery.selectAttachedFiles(
          (empOperatorDetails?.organisationStructure as LimitedCompanyOrganisation)?.evidenceFiles,
        ),
      )(),
      originalFiles: this.store.select(
        empVariationRegulatorQuery.selectOriginalAttachedFiles(
          (originalOperatorDetails?.organisationStructure as LimitedCompanyOrganisation)?.evidenceFiles,
        ),
      )(),
      declarationFiles: this.store.select(
        empCommonQuery.selectAttachedFiles(empOperatorDetails?.declarationDocuments?.documents),
      )(),
      originalDeclarationFiles: this.store.select(
        empVariationRegulatorQuery.selectOriginalAttachedFiles(
          originalOperatorDetails?.declarationDocuments?.documents,
        ),
      )(),
      variationDecisionDetails: this.store.select(
        empVariationRegulatorQuery.selectSubtaskVariationDecisionDetails(OPERATOR_DETAILS_SUB_TASK),
      )(),
      isVariationRegulatorDecision: this.store.select(empCommonQuery.selectIsVariationRegulator)(),
      hasReview: hasReview,
      empReviewDecisionDTO: this.store.select(
        empVariationReviewQuery.selectEmpReviewDecisionDTO(OPERATOR_DETAILS_SUB_TASK),
      )(),
      operatorDetailsMap: identifyMaritimeOperatorMap,
      isEditable: isEditable,
      isSubTaskCompleted: isSubTaskCompleted,
      wizardStep: OperatorDetailsWizardStep,
    };
  });

  onSubmit() {
    this.service.submitSubtask(OPERATOR_DETAILS_SUB_TASK, OperatorDetailsWizardStep.SUMMARY, this.route).subscribe();
  }
}
