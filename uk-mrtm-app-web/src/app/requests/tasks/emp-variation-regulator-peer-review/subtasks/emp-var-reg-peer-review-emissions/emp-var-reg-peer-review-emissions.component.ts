import { ChangeDetectionStrategy, Component, computed, inject, Signal } from '@angular/core';

import { EmpAcceptedVariationDecisionDetails } from '@mrtm/api';

import { PageHeadingComponent, ReturnToTaskOrActionPageComponent } from '@netz/common/components';
import { RequestTaskStore } from '@netz/common/store';

import { empCommonQuery, empVariationRegulatorPeerReviewQuery } from '@requests/common/emp/+state';
import { ListOfShipsSummaryTemplateComponent } from '@shared/components';
import { VariationRegulatorDecisionPartialSummaryTemplateComponent } from '@shared/components/summaries/variation-regulator-decision-partial-summary-template';
import { ShipEmissionTableListItem } from '@shared/types';

interface ViewModel {
  ships: ShipEmissionTableListItem[];
  variationDecisionDetails: EmpAcceptedVariationDecisionDetails;
  originalShips: ShipEmissionTableListItem[];
}

@Component({
  selector: 'mrtm-emp-var-reg-peer-review-emissions',
  imports: [
    PageHeadingComponent,
    ListOfShipsSummaryTemplateComponent,
    ReturnToTaskOrActionPageComponent,
    VariationRegulatorDecisionPartialSummaryTemplateComponent,
  ],
  standalone: true,
  templateUrl: './emp-var-reg-peer-review-emissions.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmpVarRegPeerReviewEmissionsComponent {
  private readonly store: RequestTaskStore = inject(RequestTaskStore);

  readonly vm: Signal<ViewModel> = computed(() => {
    return {
      ships: this.store.select(empCommonQuery.selectListOfShips)(),
      variationDecisionDetails: this.store.select(empVariationRegulatorPeerReviewQuery.selectReviewGroupDecisions)()?.[
        'SHIPS_CALCULATION_EMISSIONS'
      ],
      originalShips: this.store.select(empVariationRegulatorPeerReviewQuery.selectOriginalListOfShips)(),
    };
  });
}
