import { ChangeDetectionStrategy, Component, computed, inject, Signal } from '@angular/core';

import { EmpDataGaps } from '@mrtm/api';

import { AuthStore, selectUserRoleType } from '@netz/common/auth';
import { PageHeadingComponent, ReturnToTaskOrActionPageComponent } from '@netz/common/components';
import { RequestActionStore } from '@netz/common/store';

import { dataGapsMap } from '@requests/common/emp/subtasks/subtask-list.map';
import { empSubmittedQuery } from '@requests/timeline/emp-submitted/+state';
import { DataGapsSummaryTemplateComponent, ReviewDecisionSummaryTemplateComponent } from '@shared/components';
import { EmpVariationReviewDecisionDto, SubTaskListMap } from '@shared/types';

interface ViewModel {
  dataGaps: EmpDataGaps;
  dataGapsMap: SubTaskListMap<{ dataGapsMethod: string }>;
  reviewGroupDecision?: EmpVariationReviewDecisionDto | null;
}

@Component({
  selector: 'mrtm-data-gaps-submitted',
  imports: [
    PageHeadingComponent,
    DataGapsSummaryTemplateComponent,
    ReturnToTaskOrActionPageComponent,
    ReviewDecisionSummaryTemplateComponent,
  ],
  standalone: true,
  templateUrl: './data-gaps-submitted.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataGapsSubmittedComponent {
  private readonly store: RequestActionStore = inject(RequestActionStore);
  private readonly authStore = inject(AuthStore);
  protected readonly isRegulator = computed(() => this.authStore.select(selectUserRoleType)() === 'REGULATOR');

  readonly vm: Signal<ViewModel> = computed(() => ({
    dataGaps: this.store.select(empSubmittedQuery.selectDataGaps)(),
    dataGapsMap: dataGapsMap,
    reviewGroupDecision: this.store.select(empSubmittedQuery.selectReviewGroupDecision('dataGaps'))(),
  }));
}
