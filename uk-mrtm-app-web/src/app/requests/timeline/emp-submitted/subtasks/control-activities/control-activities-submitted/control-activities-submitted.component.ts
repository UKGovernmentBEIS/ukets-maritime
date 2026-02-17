import { ChangeDetectionStrategy, Component, computed, inject, Signal } from '@angular/core';

import { EmpControlActivities } from '@mrtm/api';

import { PageHeadingComponent, ReturnToTaskOrActionPageComponent } from '@netz/common/components';
import { RequestActionStore } from '@netz/common/store';

import { controlActivitiesMap } from '@requests/common/emp/subtasks/subtask-list.map';
import { empSubmittedQuery } from '@requests/timeline/emp-submitted/+state';
import { ControlActivitiesSummaryTemplateComponent, ReviewDecisionSummaryTemplateComponent } from '@shared/components';
import { EmpVariationReviewDecisionDto, SubTaskListMap } from '@shared/types';

interface ViewModel {
  controlActivities: EmpControlActivities;
  controlActivitiesMap: SubTaskListMap<EmpControlActivities>;
  reviewGroupDecision?: EmpVariationReviewDecisionDto | null;
}

@Component({
  selector: 'mrtm-control-activities-submitted',
  imports: [
    PageHeadingComponent,
    ControlActivitiesSummaryTemplateComponent,
    ReturnToTaskOrActionPageComponent,
    ReviewDecisionSummaryTemplateComponent,
  ],
  standalone: true,
  templateUrl: './control-activities-submitted.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ControlActivitiesSubmittedComponent {
  private readonly store: RequestActionStore = inject(RequestActionStore);

  readonly vm: Signal<ViewModel> = computed(() => {
    return {
      controlActivities: this.store.select(empSubmittedQuery.selectControlActivities)(),
      controlActivitiesMap: controlActivitiesMap,
      reviewGroupDecision: this.store.select(empSubmittedQuery.selectReviewGroupDecision('controlActivities'))(),
    };
  });
}
