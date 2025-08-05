import { ChangeDetectionStrategy, Component, computed, inject, Signal } from '@angular/core';

import { EmpAbbreviations, EmpAcceptedVariationDecisionDetails } from '@mrtm/api';

import { PageHeadingComponent, ReturnToTaskOrActionPageComponent } from '@netz/common/components';
import { RequestTaskStore } from '@netz/common/store';

import { empCommonQuery, empVariationRegulatorPeerReviewQuery } from '@requests/common/emp/+state';
import { abbreviationsMap } from '@requests/common/emp/subtasks/subtask-list.map';
import { AbbreviationsSummaryTemplateComponent } from '@shared/components';
import { VariationRegulatorDecisionPartialSummaryTemplateComponent } from '@shared/components/summaries/variation-regulator-decision-partial-summary-template';
import { SubTaskListMap } from '@shared/types';

interface ViewModel {
  abbreviations: EmpAbbreviations;
  originalAbbreviations: EmpAbbreviations;
  variationDecisionDetails: EmpAcceptedVariationDecisionDetails;
  abbreviationsMap: SubTaskListMap<{ abbreviationsQuestion: string }>;
}

@Component({
  selector: 'mrtm-emp-var-reg-peer-review--abbreviations',
  standalone: true,
  imports: [
    PageHeadingComponent,
    AbbreviationsSummaryTemplateComponent,
    ReturnToTaskOrActionPageComponent,
    VariationRegulatorDecisionPartialSummaryTemplateComponent,
  ],
  templateUrl: './emp-var-reg-peer-review-abbreviations.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmpVarRegPeerReviewAbbreviationsComponent {
  private readonly store: RequestTaskStore = inject(RequestTaskStore);

  vm: Signal<ViewModel> = computed(() => ({
    abbreviations: this.store.select(empCommonQuery.selectAbbreviations)(),
    originalAbbreviations: this.store.select(
      empVariationRegulatorPeerReviewQuery.selectOriginalEmissionsMonitoringPlan,
    )().abbreviations,
    variationDecisionDetails: this.store.select(empVariationRegulatorPeerReviewQuery.selectReviewGroupDecisions)()[
      'ABBREVIATIONS_AND_DEFINITIONS'
    ],
    abbreviationsMap: abbreviationsMap,
  }));
}
