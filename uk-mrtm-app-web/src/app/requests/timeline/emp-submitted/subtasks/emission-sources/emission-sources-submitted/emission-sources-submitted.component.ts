import { ChangeDetectionStrategy, Component, computed, inject, Signal } from '@angular/core';

import { EmpEmissionSources } from '@mrtm/api';

import { PageHeadingComponent, ReturnToTaskOrActionPageComponent } from '@netz/common/components';
import { RequestActionStore } from '@netz/common/store';

import { emissionSourcesMap } from '@requests/common/emp/subtasks/subtask-list.map';
import { empSubmittedQuery } from '@requests/timeline/emp-submitted/+state';
import { EmissionSourcesSummaryTemplateComponent } from '@shared/components';
import { SubTaskListMap } from '@shared/types';

interface ViewModel {
  emissionSources: EmpEmissionSources;
  emissionSourcesMap: SubTaskListMap<EmpEmissionSources>;
}

@Component({
  selector: 'mrtm-emission-sources-submitted',
  standalone: true,
  imports: [PageHeadingComponent, EmissionSourcesSummaryTemplateComponent, ReturnToTaskOrActionPageComponent],
  templateUrl: './emission-sources-submitted.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmissionSourcesSubmittedComponent {
  private readonly store: RequestActionStore = inject(RequestActionStore);

  vm: Signal<ViewModel> = computed(() => {
    return {
      emissionSources: this.store.select(empSubmittedQuery.selectEmissionSources)(),
      emissionSourcesMap: emissionSourcesMap,
    };
  });
}
