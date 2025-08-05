import { ChangeDetectionStrategy, Component, computed, inject, Signal } from '@angular/core';

import { EmpAcceptedVariationDecisionDetails, EmpEmissionSources } from '@mrtm/api';

import { PageHeadingComponent, ReturnToTaskOrActionPageComponent } from '@netz/common/components';
import { RequestTaskStore } from '@netz/common/store';

import { empCommonQuery, empVariationRegulatorPeerReviewQuery } from '@requests/common/emp/+state';
import { emissionSourcesMap } from '@requests/common/emp/subtasks/subtask-list.map';
import { EmissionSourcesSummaryTemplateComponent } from '@shared/components';
import { VariationRegulatorDecisionPartialSummaryTemplateComponent } from '@shared/components/summaries/variation-regulator-decision-partial-summary-template';
import { SubTaskListMap } from '@shared/types';

interface ViewModel {
  emissionSources: EmpEmissionSources;
  originalEmissionSources: EmpEmissionSources;
  variationDecisionDetails: EmpAcceptedVariationDecisionDetails;
  emissionSourcesMap: SubTaskListMap<EmpEmissionSources>;
}

@Component({
  selector: 'mrtm-emp-var-reg-peer-review-emission-sources',
  standalone: true,
  imports: [
    PageHeadingComponent,
    EmissionSourcesSummaryTemplateComponent,
    ReturnToTaskOrActionPageComponent,
    VariationRegulatorDecisionPartialSummaryTemplateComponent,
  ],
  templateUrl: './emp-var-reg-peer-review-emission-sources.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmpVarRegPeerReviewEmissionSourcesComponent {
  private readonly store: RequestTaskStore = inject(RequestTaskStore);

  vm: Signal<ViewModel> = computed(() => {
    return {
      emissionSources: this.store.select(empCommonQuery.selectEmissionSources)(),
      originalEmissionSources: this.store.select(
        empVariationRegulatorPeerReviewQuery.selectOriginalEmissionsMonitoringPlan,
      )().sources,
      variationDecisionDetails: this.store.select(empVariationRegulatorPeerReviewQuery.selectReviewGroupDecisions)()[
        'EMISSION_SOURCES'
      ],
      emissionSourcesMap: emissionSourcesMap,
    };
  });
}
