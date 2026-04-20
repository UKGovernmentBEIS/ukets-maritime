import { ChangeDetectionStrategy, Component, computed, inject, Signal } from '@angular/core';

import { EmpAcceptedVariationDecisionDetails, EmpControlActivities } from '@mrtm/api';

import { PageHeadingComponent, ReturnToTaskOrActionPageComponent } from '@netz/common/components';
import { RequestTaskStore } from '@netz/common/store';

import { empCommonQuery, empVariationRegulatorPeerReviewQuery } from '@requests/common/emp/+state';
import { controlActivitiesMap } from '@requests/common/emp/subtasks/subtask-list.map';
import { ControlActivitiesSummaryTemplateComponent } from '@shared/components';
import { VariationRegulatorDecisionPartialSummaryTemplateComponent } from '@shared/components/summaries/variation-regulator-decision-partial-summary-template';
import { SubTaskListMap } from '@shared/types';

interface ViewModel {
  controlActivities: EmpControlActivities;
  originalControlActivities: EmpControlActivities;
  variationDecisionDetails: EmpAcceptedVariationDecisionDetails;
  controlActivitiesMap: SubTaskListMap<EmpControlActivities>;
}

@Component({
  selector: 'mrtm-emp-var-reg-peer-review-control-activities',
  standalone: true,
  imports: [
    PageHeadingComponent,
    ControlActivitiesSummaryTemplateComponent,
    ReturnToTaskOrActionPageComponent,
    VariationRegulatorDecisionPartialSummaryTemplateComponent,
  ],
  templateUrl: './emp-var-reg-peer-review-control-activities.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmpVarRegPeerReviewControlActivitiesComponent {
  private readonly store: RequestTaskStore = inject(RequestTaskStore);

  vm: Signal<ViewModel> = computed(() => {
    return {
      controlActivities: this.store.select(empCommonQuery.selectControlActivities)(),
      originalControlActivities: this.store.select(
        empVariationRegulatorPeerReviewQuery.selectOriginalEmissionsMonitoringPlan,
      )().controlActivities,
      variationDecisionDetails: this.store.select(empVariationRegulatorPeerReviewQuery.selectReviewGroupDecisions)()[
        'CONTROL_ACTIVITIES'
      ],
      controlActivitiesMap: controlActivitiesMap,
    };
  });
}
