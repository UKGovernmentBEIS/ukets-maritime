import { ChangeDetectionStrategy, Component, computed, inject, Signal } from '@angular/core';

import { EmpAcceptedVariationDecisionDetails, EmpDataGaps } from '@mrtm/api';

import { AuthStore, selectUserRoleType } from '@netz/common/auth';
import { PageHeadingComponent, ReturnToTaskOrActionPageComponent } from '@netz/common/components';
import { RequestActionStore } from '@netz/common/store';

import { dataGapsMap } from '@requests/common/emp/subtasks/subtask-list.map';
import { empVariationSubmittedQuery } from '@requests/timeline/emp-variation-submitted/+state';
import { DataGapsSummaryTemplateComponent, ReviewDecisionSummaryTemplateComponent } from '@shared/components';
import { VariationRegulatorDecisionPartialSummaryTemplateComponent } from '@shared/components/summaries/variation-regulator-decision-partial-summary-template';
import { EmpVariationReviewDecisionDto, SubTaskListMap } from '@shared/types';

interface ViewModel {
  dataGaps: EmpDataGaps;
  dataGapsMap: SubTaskListMap<{ dataGapsMethod: string }>;
  reviewGroupDecision?: EmpVariationReviewDecisionDto | null;
  isVariationRegulator?: boolean;
  regulatorLedReason?: EmpAcceptedVariationDecisionDetails;
  isRegulator?: boolean;
}
@Component({
  selector: 'mrtm-emp-var-submitted-data-gaps',
  imports: [
    PageHeadingComponent,
    DataGapsSummaryTemplateComponent,
    ReturnToTaskOrActionPageComponent,
    ReviewDecisionSummaryTemplateComponent,
    VariationRegulatorDecisionPartialSummaryTemplateComponent,
  ],
  standalone: true,
  templateUrl: './emp-var-submitted-data-gaps.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmpVarSubmittedDataGapsComponent {
  private readonly store: RequestActionStore = inject(RequestActionStore);
  private readonly authStore: AuthStore = inject(AuthStore);

  vm: Signal<ViewModel> = computed(() => ({
    dataGaps: this.store.select(empVariationSubmittedQuery.selectDataGaps)(),
    dataGapsMap: dataGapsMap,
    reviewGroupDecision: this.store.select(empVariationSubmittedQuery.selectReviewGroupDecision('dataGaps'))(),
    isVariationRegulator: this.store.select(empVariationSubmittedQuery.selectIsVariationRegulator)(),
    regulatorLedReason: this.store.select(
      empVariationSubmittedQuery.selectVariationRegulatorDecisionDetails('dataGaps'),
    )(),
    isRegulator: this.authStore.select(selectUserRoleType)() === 'REGULATOR',
  }));
}
