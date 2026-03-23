import { ChangeDetectionStrategy, Component, computed, inject, Signal } from '@angular/core';

import { EmpAcceptedVariationDecisionDetails, EmpEmissionSources } from '@mrtm/api';

import { AuthStore, selectUserRoleType } from '@netz/common/auth';
import { PageHeadingComponent, ReturnToTaskOrActionPageComponent } from '@netz/common/components';
import { RequestActionStore } from '@netz/common/store';

import { emissionSourcesMap } from '@requests/common/emp/subtasks/subtask-list.map';
import { empVariationSubmittedQuery } from '@requests/timeline/emp-variation-submitted/+state';
import { EmissionSourcesSummaryTemplateComponent, ReviewDecisionSummaryTemplateComponent } from '@shared/components';
import { VariationRegulatorDecisionPartialSummaryTemplateComponent } from '@shared/components/summaries/variation-regulator-decision-partial-summary-template';
import { EmpVariationReviewDecisionDto, SubTaskListMap } from '@shared/types';

interface ViewModel {
  emissionSources: EmpEmissionSources;
  emissionSourcesMap: SubTaskListMap<EmpEmissionSources>;
  reviewGroupDecision?: EmpVariationReviewDecisionDto | null;
  isVariationRegulator?: boolean;
  regulatorLedReason?: EmpAcceptedVariationDecisionDetails;
  isRegulator?: boolean;
}

@Component({
  selector: 'mrtm-emp-var-submitted-emission-sources',
  imports: [
    PageHeadingComponent,
    EmissionSourcesSummaryTemplateComponent,
    ReturnToTaskOrActionPageComponent,
    ReviewDecisionSummaryTemplateComponent,
    VariationRegulatorDecisionPartialSummaryTemplateComponent,
  ],
  standalone: true,
  templateUrl: './emp-var-submitted-emission-sources.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmpVarSubmittedEmissionSourcesComponent {
  private readonly store: RequestActionStore = inject(RequestActionStore);
  private readonly authStore: AuthStore = inject(AuthStore);

  vm: Signal<ViewModel> = computed(() => {
    return {
      emissionSources: this.store.select(empVariationSubmittedQuery.selectEmissionSources)(),
      emissionSourcesMap: emissionSourcesMap,
      reviewGroupDecision: this.store.select(empVariationSubmittedQuery.selectReviewGroupDecision('sources'))(),
      isVariationRegulator: this.store.select(empVariationSubmittedQuery.selectIsVariationRegulator)(),
      regulatorLedReason: this.store.select(
        empVariationSubmittedQuery.selectVariationRegulatorDecisionDetails('sources'),
      )(),
      isRegulator: this.authStore.select(selectUserRoleType)() === 'REGULATOR',
    };
  });
}
