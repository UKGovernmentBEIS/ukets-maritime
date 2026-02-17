import { ChangeDetectionStrategy, Component, computed, inject, Signal } from '@angular/core';

import { EmpAcceptedVariationDecisionDetails, EmpControlActivities } from '@mrtm/api';

import { AuthStore, selectUserRoleType } from '@netz/common/auth';
import { PageHeadingComponent, ReturnToTaskOrActionPageComponent } from '@netz/common/components';
import { RequestActionStore } from '@netz/common/store';

import { controlActivitiesMap } from '@requests/common/emp/subtasks/subtask-list.map';
import { empVariationSubmittedQuery } from '@requests/timeline/emp-variation-submitted/+state';
import { ControlActivitiesSummaryTemplateComponent, ReviewDecisionSummaryTemplateComponent } from '@shared/components';
import { VariationRegulatorDecisionPartialSummaryTemplateComponent } from '@shared/components/summaries/variation-regulator-decision-partial-summary-template';
import { EmpVariationReviewDecisionDto, SubTaskListMap } from '@shared/types';

interface ViewModel {
  controlActivities: EmpControlActivities;
  controlActivitiesMap: SubTaskListMap<EmpControlActivities>;
  reviewGroupDecision?: EmpVariationReviewDecisionDto | null;
  isVariationRegulator?: boolean;
  regulatorLedReason?: EmpAcceptedVariationDecisionDetails;
  isRegulator?: boolean;
}

@Component({
  selector: 'mrtm-emp-var-submitted-control-activities',
  imports: [
    PageHeadingComponent,
    ControlActivitiesSummaryTemplateComponent,
    ReturnToTaskOrActionPageComponent,
    ReviewDecisionSummaryTemplateComponent,
    VariationRegulatorDecisionPartialSummaryTemplateComponent,
  ],
  standalone: true,
  templateUrl: './emp-var-submitted-control-activities.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmpVarSubmittedControlActivitiesComponent {
  private readonly store: RequestActionStore = inject(RequestActionStore);
  private readonly authStore: AuthStore = inject(AuthStore);

  readonly vm: Signal<ViewModel> = computed(() => {
    return {
      controlActivities: this.store.select(empVariationSubmittedQuery.selectControlActivities)(),
      controlActivitiesMap: controlActivitiesMap,
      reviewGroupDecision: this.store.select(
        empVariationSubmittedQuery.selectReviewGroupDecision('controlActivities'),
      )(),
      isVariationRegulator: this.store.select(empVariationSubmittedQuery.selectIsVariationRegulator)(),
      regulatorLedReason: this.store.select(
        empVariationSubmittedQuery.selectVariationRegulatorDecisionDetails('controlActivities'),
      )(),
      isRegulator: this.authStore.select(selectUserRoleType)() === 'REGULATOR',
    };
  });
}
