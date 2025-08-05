import { ChangeDetectionStrategy, Component, computed, inject, Signal } from '@angular/core';

import { EmpDataGaps } from '@mrtm/api';

import { PageHeadingComponent, ReturnToTaskOrActionPageComponent } from '@netz/common/components';
import { RequestActionStore } from '@netz/common/store';

import { dataGapsMap } from '@requests/common/emp/subtasks/subtask-list.map';
import { empSubmittedQuery } from '@requests/timeline/emp-submitted/+state';
import { DataGapsSummaryTemplateComponent } from '@shared/components';
import { SubTaskListMap } from '@shared/types';

interface ViewModel {
  dataGaps: EmpDataGaps;
  dataGapsMap: SubTaskListMap<{ dataGapsMethod: string }>;
}

@Component({
  selector: 'mrtm-data-gaps-submitted',
  standalone: true,
  imports: [PageHeadingComponent, DataGapsSummaryTemplateComponent, ReturnToTaskOrActionPageComponent],
  templateUrl: './data-gaps-submitted.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataGapsSubmittedComponent {
  private readonly store: RequestActionStore = inject(RequestActionStore);

  vm: Signal<ViewModel> = computed(() => ({
    dataGaps: this.store.select(empSubmittedQuery.selectDataGaps)(),
    dataGapsMap: dataGapsMap,
  }));
}
