import { ChangeDetectionStrategy, Component, computed, inject, Signal } from '@angular/core';

import { EmpMonitoringGreenhouseGas } from '@mrtm/api';

import { PageHeadingComponent, ReturnToTaskOrActionPageComponent } from '@netz/common/components';
import { RequestActionStore } from '@netz/common/store';

import { greenhouseGasMap } from '@requests/common/emp/subtasks/subtask-list.map';
import { empSubmittedQuery } from '@requests/timeline/emp-submitted/+state';
import { GreenhousesSummaryTemplateComponent } from '@shared/components';
import { SubTaskListMap } from '@shared/types';

interface ViewModel {
  greenhouseGas: EmpMonitoringGreenhouseGas;
  greenhouseGasMap: SubTaskListMap<EmpMonitoringGreenhouseGas>;
}

@Component({
  selector: 'mrtm-greenhouse-gas-submitted',
  standalone: true,
  imports: [PageHeadingComponent, ReturnToTaskOrActionPageComponent, GreenhousesSummaryTemplateComponent],
  templateUrl: './greenhouse-gas-submitted.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GreenhouseGasSubmittedComponent {
  private readonly store: RequestActionStore = inject(RequestActionStore);

  vm: Signal<ViewModel> = computed(() => ({
    greenhouseGas: this.store.select(empSubmittedQuery.selectGreenhouseGas)(),
    greenhouseGasMap: greenhouseGasMap,
  }));
}
