import { ChangeDetectionStrategy, Component, computed, inject, Signal } from '@angular/core';

import { EmpAbbreviations } from '@mrtm/api';

import { PageHeadingComponent, ReturnToTaskOrActionPageComponent } from '@netz/common/components';
import { RequestActionStore } from '@netz/common/store';

import { abbreviationsMap } from '@requests/common/emp/subtasks/subtask-list.map';
import { empVariationSubmittedQuery } from '@requests/timeline/emp-variation-submitted/+state';
import { AbbreviationsSummaryTemplateComponent } from '@shared/components';
import { SubTaskListMap } from '@shared/types';

interface ViewModel {
  abbreviations: EmpAbbreviations;
  abbreviationsMap: SubTaskListMap<{ abbreviationsQuestion: string }>;
}

@Component({
  selector: 'mrtm-emp-var-submitted-abbreviations',
  standalone: true,
  imports: [PageHeadingComponent, AbbreviationsSummaryTemplateComponent, ReturnToTaskOrActionPageComponent],
  templateUrl: './emp-var-submitted-abbreviations.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmpVarSubmittedAbbreviationsComponent {
  private readonly store: RequestActionStore = inject(RequestActionStore);

  vm: Signal<ViewModel> = computed(() => ({
    abbreviations: this.store.select(empVariationSubmittedQuery.selectAbbreviations)(),
    abbreviationsMap: abbreviationsMap,
  }));
}
