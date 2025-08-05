import { ChangeDetectionStrategy, Component, computed, inject, Signal } from '@angular/core';

import { EmpEmissionSources } from '@mrtm/api';

import { PageHeadingComponent, ReturnToTaskOrActionPageComponent } from '@netz/common/components';
import { RequestActionStore } from '@netz/common/store';

import { emissionSourcesMap } from '@requests/common/emp/subtasks/subtask-list.map';
import { empVariationSubmittedQuery } from '@requests/timeline/emp-variation-submitted/+state';
import { EmissionSourcesSummaryTemplateComponent } from '@shared/components';
import { SubTaskListMap } from '@shared/types';

interface ViewModel {
  emissionSources: EmpEmissionSources;
  emissionSourcesMap: SubTaskListMap<EmpEmissionSources>;
}

@Component({
  selector: 'mrtm-emp-var-submitted-emission-sources',
  standalone: true,
  imports: [PageHeadingComponent, EmissionSourcesSummaryTemplateComponent, ReturnToTaskOrActionPageComponent],
  templateUrl: './emp-var-submitted-emission-sources.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmpVarSubmittedEmissionSourcesComponent {
  private readonly store: RequestActionStore = inject(RequestActionStore);

  vm: Signal<ViewModel> = computed(() => {
    return {
      emissionSources: this.store.select(empVariationSubmittedQuery.selectEmissionSources)(),
      emissionSourcesMap: emissionSourcesMap,
    };
  });
}
