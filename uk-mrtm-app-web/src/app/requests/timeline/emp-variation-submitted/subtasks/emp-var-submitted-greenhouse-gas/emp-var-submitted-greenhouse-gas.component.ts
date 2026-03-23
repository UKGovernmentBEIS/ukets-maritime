import { ChangeDetectionStrategy, Component, computed, inject, Signal } from '@angular/core';

import { EmpAcceptedVariationDecisionDetails, EmpMonitoringGreenhouseGas } from '@mrtm/api';

import { AuthStore, selectUserRoleType } from '@netz/common/auth';
import { PageHeadingComponent, ReturnToTaskOrActionPageComponent } from '@netz/common/components';
import { RequestActionStore } from '@netz/common/store';

import { greenhouseGasMap } from '@requests/common/emp/subtasks/subtask-list.map';
import { empVariationSubmittedQuery } from '@requests/timeline/emp-variation-submitted/+state';
import { GreenhousesSummaryTemplateComponent, ReviewDecisionSummaryTemplateComponent } from '@shared/components';
import { VariationRegulatorDecisionPartialSummaryTemplateComponent } from '@shared/components/summaries/variation-regulator-decision-partial-summary-template';
import { EmpVariationReviewDecisionDto, SubTaskListMap } from '@shared/types';

interface ViewModel {
  greenhouseGas: EmpMonitoringGreenhouseGas;
  greenhouseGasMap: SubTaskListMap<EmpMonitoringGreenhouseGas>;
  reviewGroupDecision?: EmpVariationReviewDecisionDto | null;
  isVariationRegulator?: boolean;
  regulatorLedReason?: EmpAcceptedVariationDecisionDetails;
  isRegulator?: boolean;
}

@Component({
  selector: 'mrtm-emp-var-submitted-greenhouse-gas',
  imports: [
    PageHeadingComponent,
    ReturnToTaskOrActionPageComponent,
    GreenhousesSummaryTemplateComponent,
    ReviewDecisionSummaryTemplateComponent,
    VariationRegulatorDecisionPartialSummaryTemplateComponent,
  ],
  standalone: true,
  templateUrl: './emp-var-submitted-greenhouse-gas.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmpVarSubmittedGreenhouseGasComponent {
  private readonly store: RequestActionStore = inject(RequestActionStore);
  private readonly authStore: AuthStore = inject(AuthStore);

  vm: Signal<ViewModel> = computed(() => ({
    greenhouseGas: this.store.select(empVariationSubmittedQuery.selectGreenhouseGas)(),
    greenhouseGasMap: greenhouseGasMap,
    reviewGroupDecision: this.store.select(empVariationSubmittedQuery.selectReviewGroupDecision('greenhouseGas'))(),
    isVariationRegulator: this.store.select(empVariationSubmittedQuery.selectIsVariationRegulator)(),
    regulatorLedReason: this.store.select(
      empVariationSubmittedQuery.selectVariationRegulatorDecisionDetails('greenhouseGas'),
    )(),
    isRegulator: this.authStore.select(selectUserRoleType)() === 'REGULATOR',
  }));
}
