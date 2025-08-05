import { ChangeDetectionStrategy, Component, computed, inject, Signal } from '@angular/core';

import { EmpVariationDetails, EmpVariationRegulatorLedReason } from '@mrtm/api';

import { PageHeadingComponent, ReturnToTaskOrActionPageComponent } from '@netz/common/components';
import { RequestTaskStore } from '@netz/common/store';

import { empVariationRegulatorPeerReviewQuery } from '@requests/common/emp/+state';
import { variationDetailsSubtaskMap } from '@requests/common/emp/subtasks/subtask-list.map';
import { VariationDetailsSummaryTemplateComponent } from '@shared/components';

interface ViewModel {
  variationDetails: EmpVariationDetails;
  title: string;
  regulatorLedReason: EmpVariationRegulatorLedReason;
}

@Component({
  selector: 'mrtm-emp-var-reg-peer-review-variation-details',
  standalone: true,
  imports: [PageHeadingComponent, VariationDetailsSummaryTemplateComponent, ReturnToTaskOrActionPageComponent],
  templateUrl: './emp-var-reg-peer-review-variation-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmpVarRegPeerReviewVariationDetailsComponent {
  private readonly store: RequestTaskStore = inject(RequestTaskStore);
  vm: Signal<ViewModel> = computed(() => {
    return {
      variationDetails: this.store.select(empVariationRegulatorPeerReviewQuery.selectEmpVariationDetails)(),
      title: variationDetailsSubtaskMap.title,
      regulatorLedReason: this.store.select(empVariationRegulatorPeerReviewQuery.selectReasonRegulatorLed)(),
    };
  });
}
