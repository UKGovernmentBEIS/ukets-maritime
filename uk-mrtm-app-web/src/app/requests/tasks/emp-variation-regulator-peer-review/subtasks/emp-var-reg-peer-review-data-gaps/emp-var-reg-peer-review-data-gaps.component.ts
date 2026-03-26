import { ChangeDetectionStrategy, Component, computed, inject, Signal } from '@angular/core';

import { EmpAcceptedVariationDecisionDetails, EmpDataGaps } from '@mrtm/api';

import { PageHeadingComponent, ReturnToTaskOrActionPageComponent } from '@netz/common/components';
import { RequestTaskStore } from '@netz/common/store';

import { empCommonQuery, empVariationRegulatorPeerReviewQuery } from '@requests/common/emp/+state';
import { dataGapsMap } from '@requests/common/emp/subtasks/subtask-list.map';
import { DataGapsSummaryTemplateComponent } from '@shared/components';
import { VariationRegulatorDecisionPartialSummaryTemplateComponent } from '@shared/components/summaries/variation-regulator-decision-partial-summary-template';

interface ViewModel {
  dataGaps: EmpDataGaps;
  originalDataGaps: EmpDataGaps;
  variationDecisionDetails: EmpAcceptedVariationDecisionDetails;
  title: string;
}

@Component({
  selector: 'mrtm-emp-var-reg-peer-review-data-gaps',
  imports: [
    PageHeadingComponent,
    DataGapsSummaryTemplateComponent,
    ReturnToTaskOrActionPageComponent,
    VariationRegulatorDecisionPartialSummaryTemplateComponent,
  ],
  standalone: true,
  templateUrl: './emp-var-reg-peer-review-data-gaps.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmpVarRegPeerReviewDataGapsComponent {
  private readonly store: RequestTaskStore = inject(RequestTaskStore);

  readonly vm: Signal<ViewModel> = computed(() => ({
    dataGaps: this.store.select(empCommonQuery.selectDataGaps)(),
    originalDataGaps: this.store.select(empVariationRegulatorPeerReviewQuery.selectOriginalEmissionsMonitoringPlan)()
      .dataGaps,
    variationDecisionDetails: this.store.select(empVariationRegulatorPeerReviewQuery.selectReviewGroupDecisions)()[
      'DATA_GAPS'
    ],
    title: dataGapsMap.title,
  }));
}
