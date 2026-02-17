import { ChangeDetectionStrategy, Component, computed, inject, Signal } from '@angular/core';

import { EmpAcceptedVariationDecisionDetails, EmpMonitoringGreenhouseGas } from '@mrtm/api';

import { PageHeadingComponent, ReturnToTaskOrActionPageComponent } from '@netz/common/components';
import { RequestTaskStore } from '@netz/common/store';

import { empCommonQuery, empVariationRegulatorPeerReviewQuery } from '@requests/common/emp/+state';
import { greenhouseGasMap } from '@requests/common/emp/subtasks/subtask-list.map';
import { GreenhousesSummaryTemplateComponent } from '@shared/components';
import { VariationRegulatorDecisionPartialSummaryTemplateComponent } from '@shared/components/summaries/variation-regulator-decision-partial-summary-template';
import { SubTaskListMap } from '@shared/types';

interface ViewModel {
  greenhouseGas: EmpMonitoringGreenhouseGas;
  originalGreenhouseGas: EmpMonitoringGreenhouseGas;
  variationDecisionDetails: EmpAcceptedVariationDecisionDetails;
  greenhouseGasMap: SubTaskListMap<EmpMonitoringGreenhouseGas>;
}

@Component({
  selector: 'mrtm-emp-var-reg-peer-review-greenhouse-gas',
  imports: [
    PageHeadingComponent,
    ReturnToTaskOrActionPageComponent,
    GreenhousesSummaryTemplateComponent,
    VariationRegulatorDecisionPartialSummaryTemplateComponent,
  ],
  standalone: true,
  templateUrl: './emp-var-reg-peer-review-greenhouse-gas.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmpVarRegPeerReviewGreenhouseGasComponent {
  private readonly store: RequestTaskStore = inject(RequestTaskStore);

  readonly vm: Signal<ViewModel> = computed(() => ({
    greenhouseGas: this.store.select(empCommonQuery.selectGreenhouseGas)(),
    originalGreenhouseGas: this.store.select(
      empVariationRegulatorPeerReviewQuery.selectOriginalEmissionsMonitoringPlan,
    )().greenhouseGas,
    variationDecisionDetails: this.store.select(empVariationRegulatorPeerReviewQuery.selectReviewGroupDecisions)()[
      'MONITORING_APPROACH'
    ],
    greenhouseGasMap: greenhouseGasMap,
  }));
}
