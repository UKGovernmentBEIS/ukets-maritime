import { ChangeDetectionStrategy, Component, computed, inject, Signal } from '@angular/core';

import { EmpMonitoringGreenhouseGas } from '@mrtm/api';

import { PageHeadingComponent, ReturnToTaskOrActionPageComponent } from '@netz/common/components';
import { RequestActionStore } from '@netz/common/store';

import { greenhouseGasMap } from '@requests/common/emp/subtasks/subtask-list.map';
import { empVariationSubmittedQuery } from '@requests/timeline/emp-variation-submitted/+state';
import { GreenhousesSummaryTemplateComponent } from '@shared/components';
import { SubTaskListMap } from '@shared/types';

interface ViewModel {
  greenhouseGas: EmpMonitoringGreenhouseGas;
  greenhouseGasMap: SubTaskListMap<EmpMonitoringGreenhouseGas>;
}

@Component({
  selector: 'mrtm-emp-var-submitted-greenhouse-gas',
  standalone: true,
  imports: [PageHeadingComponent, ReturnToTaskOrActionPageComponent, GreenhousesSummaryTemplateComponent],
  templateUrl: './emp-var-submitted-greenhouse-gas.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmpVarSubmittedGreenhouseGasComponent {
  private readonly store: RequestActionStore = inject(RequestActionStore);

  vm: Signal<ViewModel> = computed(() => ({
    greenhouseGas: this.store.select(empVariationSubmittedQuery.selectGreenhouseGas)(),
    greenhouseGasMap: greenhouseGasMap,
  }));
}
