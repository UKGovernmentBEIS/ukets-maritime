import { ChangeDetectionStrategy, Component, computed, inject, Signal } from '@angular/core';

import { EmpAbbreviations, EmpAcceptedVariationDecisionDetails } from '@mrtm/api';

import { AuthStore, selectUserRoleType } from '@netz/common/auth';
import { PageHeadingComponent, ReturnToTaskOrActionPageComponent } from '@netz/common/components';
import { RequestActionStore } from '@netz/common/store';

import { abbreviationsMap } from '@requests/common/emp/subtasks/subtask-list.map';
import { empVariationSubmittedQuery } from '@requests/timeline/emp-variation-submitted/+state';
import { AbbreviationsSummaryTemplateComponent, ReviewDecisionSummaryTemplateComponent } from '@shared/components';
import { VariationRegulatorDecisionPartialSummaryTemplateComponent } from '@shared/components/summaries/variation-regulator-decision-partial-summary-template';
import { EmpVariationReviewDecisionDto, SubTaskListMap } from '@shared/types';

interface ViewModel {
  abbreviations: EmpAbbreviations;
  abbreviationsMap: SubTaskListMap<{ abbreviationsQuestion: string }>;
  reviewGroupDecision?: EmpVariationReviewDecisionDto | null;
  isVariationRegulator?: boolean;
  regulatorLedReason?: EmpAcceptedVariationDecisionDetails;
  isRegulator?: boolean;
}

@Component({
  selector: 'mrtm-emp-var-submitted-abbreviations',
  imports: [
    PageHeadingComponent,
    AbbreviationsSummaryTemplateComponent,
    ReturnToTaskOrActionPageComponent,
    ReviewDecisionSummaryTemplateComponent,
    VariationRegulatorDecisionPartialSummaryTemplateComponent,
  ],
  standalone: true,
  templateUrl: './emp-var-submitted-abbreviations.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmpVarSubmittedAbbreviationsComponent {
  private readonly store: RequestActionStore = inject(RequestActionStore);
  private readonly authStore: AuthStore = inject(AuthStore);

  readonly vm: Signal<ViewModel> = computed(() => ({
    abbreviations: this.store.select(empVariationSubmittedQuery.selectAbbreviations)(),
    abbreviationsMap: abbreviationsMap,
    reviewGroupDecision: this.store.select(empVariationSubmittedQuery.selectReviewGroupDecision('abbreviations'))(),
    isVariationRegulator: this.store.select(empVariationSubmittedQuery.selectIsVariationRegulator)(),
    regulatorLedReason: this.store.select(
      empVariationSubmittedQuery.selectVariationRegulatorDecisionDetails('abbreviations'),
    )(),
    isRegulator: this.authStore.select(selectUserRoleType)() === 'REGULATOR',
  }));
}
