import { ChangeDetectionStrategy, Component, computed, inject, Signal } from '@angular/core';

import { EmpControlActivities } from '@mrtm/api';

import { PageHeadingComponent, ReturnToTaskOrActionPageComponent } from '@netz/common/components';
import { RequestActionStore } from '@netz/common/store';

import { controlActivitiesMap } from '@requests/common/emp/subtasks/subtask-list.map';
import { empVariationSubmittedQuery } from '@requests/timeline/emp-variation-submitted/+state';
import { ControlActivitiesSummaryTemplateComponent } from '@shared/components';
import { SubTaskListMap } from '@shared/types';

interface ViewModel {
  controlActivities: EmpControlActivities;
  controlActivitiesMap: SubTaskListMap<EmpControlActivities>;
}

@Component({
  selector: 'mrtm-emp-var-submitted-control-activities',
  standalone: true,
  imports: [PageHeadingComponent, ControlActivitiesSummaryTemplateComponent, ReturnToTaskOrActionPageComponent],
  templateUrl: './emp-var-submitted-control-activities.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmpVarSubmittedControlActivitiesComponent {
  private readonly store: RequestActionStore = inject(RequestActionStore);

  vm: Signal<ViewModel> = computed(() => {
    return {
      controlActivities: this.store.select(empVariationSubmittedQuery.selectControlActivities)(),
      controlActivitiesMap: controlActivitiesMap,
    };
  });
}
