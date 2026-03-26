import { ChangeDetectionStrategy, Component, computed, inject, Signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { EmpAcceptedVariationDecisionDetails, EmpMonitoringGreenhouseGas } from '@mrtm/api';

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
import { GREENHOUSE_GAS_SUB_TASK, GreenhouseGasWizardStep } from '@requests/common/emp/subtasks/greenhouse-gas';
import { greenhouseGasMap } from '@requests/common/emp/subtasks/subtask-list.map';
import { GreenhousesSummaryTemplateComponent, ReviewDecisionSummaryTemplateComponent } from '@shared/components';
import { VariationRegulatorDecisionPartialSummaryTemplateComponent } from '@shared/components/summaries/variation-regulator-decision-partial-summary-template';
import { EmpVariationReviewDecisionDto, SubTaskListMap } from '@shared/types';

interface ViewModel {
  greenhouseGas: EmpMonitoringGreenhouseGas;
  originalGreenhouseGas: EmpMonitoringGreenhouseGas;
  isVariationRegulatorDecision: boolean;
  variationDecisionDetails: EmpAcceptedVariationDecisionDetails;
  hasReview: boolean;
  empReviewDecisionDTO: EmpVariationReviewDecisionDto;
  greenhouseGasMap: SubTaskListMap<EmpMonitoringGreenhouseGas>;
  isEditable: boolean;
  isSubTaskCompleted: boolean;
  wizardStep?: { [s: string]: string };
}

@Component({
  selector: 'mrtm-greenhouse-gas-summary',
  imports: [
    ButtonDirective,
    PageHeadingComponent,
    PendingButtonDirective,
    ReturnToTaskOrActionPageComponent,
    GreenhousesSummaryTemplateComponent,
    VariationRegulatorDecisionPartialSummaryTemplateComponent,
    ReviewDecisionSummaryTemplateComponent,
  ],
  standalone: true,
  templateUrl: './greenhouse-gas-summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GreenhouseGasSummaryComponent {
  private readonly service: TaskService<EmpTaskPayload> = inject(TaskService<EmpTaskPayload>);
  private readonly store: RequestTaskStore = inject(RequestTaskStore);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);

  readonly vm: Signal<ViewModel> = computed(() => {
    const hasReview = this.store.select(empCommonQuery.selectHasReview)();
    const isEditable = this.store.select(empCommonQuery.selectIsPeerReview)()
      ? false
      : this.store.select(requestTaskQuery.selectIsEditable)();
    const isSubTaskCompleted = hasReview
      ? this.store.select(empReviewQuery.selectIsSubtaskCompleted(GREENHOUSE_GAS_SUB_TASK))()
      : this.store.select(empCommonQuery.selectIsSubtaskCompleted(GREENHOUSE_GAS_SUB_TASK))();

    return {
      greenhouseGas: this.store.select(empCommonQuery.selectGreenhouseGas)(),
      originalGreenhouseGas: this.store.select(empVariationRegulatorQuery.selectOriginalGreenhouseGas)(),
      variationDecisionDetails: this.store.select(
        empVariationRegulatorQuery.selectSubtaskVariationDecisionDetails(GREENHOUSE_GAS_SUB_TASK),
      )(),
      isVariationRegulatorDecision: this.store.select(empCommonQuery.selectIsVariationRegulator)(),
      hasReview: hasReview,
      empReviewDecisionDTO: this.store.select(
        empVariationReviewQuery.selectEmpReviewDecisionDTO(GREENHOUSE_GAS_SUB_TASK),
      )(),
      greenhouseGasMap: greenhouseGasMap,
      isEditable: isEditable,
      isSubTaskCompleted: isSubTaskCompleted,
      wizardStep: GreenhouseGasWizardStep,
    };
  });

  onSubmit() {
    this.service.submitSubtask(GREENHOUSE_GAS_SUB_TASK, GreenhouseGasWizardStep.SUMMARY, this.route).subscribe();
  }
}
