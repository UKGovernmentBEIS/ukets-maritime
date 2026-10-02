import { ChangeDetectionStrategy, Component, computed, inject, Signal } from '@angular/core';

import { EmpAbbreviations } from '@mrtm/api';

import { AuthStore, selectUserRoleType } from '@netz/common/auth';
import { PageHeadingComponent, ReturnToTaskOrActionPageComponent } from '@netz/common/components';
import { RequestActionStore } from '@netz/common/store';

import { abbreviationsMap } from '@requests/common/emp/subtasks/subtask-list.map';
import { empSubmittedQuery } from '@requests/timeline/emp-submitted/+state';
import { AbbreviationsSummaryTemplateComponent, ReviewDecisionSummaryTemplateComponent } from '@shared/components';
import { EmpVariationReviewDecisionDto, SubTaskListMap } from '@shared/types';

interface ViewModel {
  abbreviations: EmpAbbreviations;
  abbreviationsMap: SubTaskListMap<{ abbreviationsQuestion: string }>;
  reviewGroupDecision?: EmpVariationReviewDecisionDto | null;
}

@Component({
  selector: 'mrtm-abbreviations-submitted',
  imports: [
    PageHeadingComponent,
    AbbreviationsSummaryTemplateComponent,
    ReturnToTaskOrActionPageComponent,
    ReviewDecisionSummaryTemplateComponent,
  ],
  standalone: true,
  templateUrl: './abbreviations-submitted.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AbbreviationsSubmittedComponent {
  private readonly store: RequestActionStore = inject(RequestActionStore);
  private readonly authStore = inject(AuthStore);
  protected readonly isRegulator = computed(() => this.authStore.select(selectUserRoleType)() === 'REGULATOR');

  readonly vm: Signal<ViewModel> = computed(() => ({
    abbreviations: this.store.select(empSubmittedQuery.selectAbbreviations)(),
    abbreviationsMap: abbreviationsMap,
    reviewGroupDecision: this.store.select(empSubmittedQuery.selectReviewGroupDecision('abbreviations'))(),
  }));
}
