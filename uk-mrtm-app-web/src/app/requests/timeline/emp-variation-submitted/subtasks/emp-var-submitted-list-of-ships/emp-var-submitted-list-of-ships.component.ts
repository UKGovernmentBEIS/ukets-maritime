import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { AuthStore, selectUserRoleType } from '@netz/common/auth';
import { PageHeadingComponent, ReturnToTaskOrActionPageComponent } from '@netz/common/components';
import { RequestActionStore } from '@netz/common/store';

import { empVariationSubmittedQuery } from '@requests/timeline/emp-variation-submitted/+state';
import {
  ListOfShipsSummaryTemplateComponent,
  ReviewDecisionSummaryTemplateComponent,
} from '@shared/components/summaries';
import { VariationRegulatorDecisionPartialSummaryTemplateComponent } from '@shared/components/summaries/variation-regulator-decision-partial-summary-template';

@Component({
  selector: 'mrtm-emp-var-submitted-list-of-ships',
  imports: [
    PageHeadingComponent,
    ListOfShipsSummaryTemplateComponent,
    ReturnToTaskOrActionPageComponent,
    ReviewDecisionSummaryTemplateComponent,
    VariationRegulatorDecisionPartialSummaryTemplateComponent,
  ],
  standalone: true,
  templateUrl: './emp-var-submitted-list-of-ships.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmpVarSubmittedListOfShipsComponent {
  private readonly store: RequestActionStore = inject(RequestActionStore);
  private readonly authStore: AuthStore = inject(AuthStore);

  public readonly ships = this.store.select(empVariationSubmittedQuery.selectListOfShips)();

  public readonly isVariationRegulator = this.store.select(empVariationSubmittedQuery.selectIsVariationRegulator);
  public readonly reviewGroupDecision = computed(() => {
    if (this.isVariationRegulator()) {
      return undefined;
    }

    return this.store.select(empVariationSubmittedQuery.selectReviewGroupDecision('emissions'))();
  });

  public readonly regulatorLedReason = this.store.select(
    empVariationSubmittedQuery.selectVariationRegulatorDecisionDetails('emissions'),
  );

  public readonly isRegulator = computed(() => this.authStore.select(selectUserRoleType)() === 'REGULATOR');
}
