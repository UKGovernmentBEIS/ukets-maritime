import { ChangeDetectionStrategy, Component, computed, inject, Signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { EmpAcceptedVariationDecisionDetails, EmpDataGaps } from '@mrtm/api';

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
import { DATA_GAPS_SUB_TASK, DataGapsWizardStep } from '@requests/common/emp/subtasks/data-gaps';
import { dataGapsMap } from '@requests/common/emp/subtasks/subtask-list.map';
import { DataGapsSummaryTemplateComponent, ReviewDecisionSummaryTemplateComponent } from '@shared/components';
import { VariationRegulatorDecisionPartialSummaryTemplateComponent } from '@shared/components/summaries/variation-regulator-decision-partial-summary-template';
import { EmpVariationReviewDecisionDto, SubTaskListMap } from '@shared/types';

interface ViewModel {
  dataGaps: EmpDataGaps;
  originalDataGaps: EmpDataGaps;
  isVariationRegulatorDecision: boolean;
  variationDecisionDetails: EmpAcceptedVariationDecisionDetails;
  hasReview: boolean;
  empReviewDecisionDTO: EmpVariationReviewDecisionDto;
  dataGapsMap: SubTaskListMap<{ dataGapsMethod: string }>;
  isEditable: boolean;
  isSubTaskCompleted: boolean;
  wizardStep: { [s: string]: string };
}

@Component({
  selector: 'mrtm-data-gaps-summary',
  imports: [
    PageHeadingComponent,
    DataGapsSummaryTemplateComponent,
    PendingButtonDirective,
    ButtonDirective,
    ReturnToTaskOrActionPageComponent,
    VariationRegulatorDecisionPartialSummaryTemplateComponent,
    ReviewDecisionSummaryTemplateComponent,
  ],
  standalone: true,
  templateUrl: './data-gaps-summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataGapsSummaryComponent {
  private readonly service: TaskService<EmpTaskPayload> = inject(TaskService<EmpTaskPayload>);
  private readonly store: RequestTaskStore = inject(RequestTaskStore);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);

  readonly vm: Signal<ViewModel> = computed(() => {
    const hasReview = this.store.select(empCommonQuery.selectHasReview)();
    const isEditable = this.store.select(empCommonQuery.selectIsPeerReview)()
      ? false
      : this.store.select(requestTaskQuery.selectIsEditable)();
    const isSubTaskCompleted = hasReview
      ? this.store.select(empReviewQuery.selectIsSubtaskCompleted(DATA_GAPS_SUB_TASK))()
      : this.store.select(empCommonQuery.selectIsSubtaskCompleted(DATA_GAPS_SUB_TASK))();

    return {
      dataGaps: this.store.select(empCommonQuery.selectDataGaps)(),
      originalDataGaps: this.store.select(empVariationRegulatorQuery.selectOriginalDataGaps)(),
      variationDecisionDetails: this.store.select(
        empVariationRegulatorQuery.selectSubtaskVariationDecisionDetails(DATA_GAPS_SUB_TASK),
      )(),
      isVariationRegulatorDecision: this.store.select(empCommonQuery.selectIsVariationRegulator)(),
      hasReview: hasReview,
      empReviewDecisionDTO: this.store.select(empVariationReviewQuery.selectEmpReviewDecisionDTO(DATA_GAPS_SUB_TASK))(),
      dataGapsMap: dataGapsMap,
      isEditable: isEditable,
      isSubTaskCompleted: isSubTaskCompleted,
      wizardStep: DataGapsWizardStep,
    };
  });

  onSubmit() {
    this.service.submitSubtask(DATA_GAPS_SUB_TASK, DataGapsWizardStep.SUMMARY, this.route).subscribe();
  }
}
