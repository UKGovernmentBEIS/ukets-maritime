import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { AuthStore, selectUserRoleType } from '@netz/common/auth';
import { PageHeadingComponent, ReturnToTaskOrActionPageComponent } from '@netz/common/components';
import { RequestActionStore } from '@netz/common/store';

import { mandateMap } from '@requests/common/emp/subtasks/subtask-list.map';
import { empVariationSubmittedQuery } from '@requests/timeline/emp-variation-submitted/+state';
import { MandateSummaryTemplateComponent, ReviewDecisionSummaryTemplateComponent } from '@shared/components';
import { VariationRegulatorDecisionPartialSummaryTemplateComponent } from '@shared/components/summaries/variation-regulator-decision-partial-summary-template';

@Component({
  selector: 'mrtm-emp-var-submitted-mandate',
  imports: [
    PageHeadingComponent,
    ReturnToTaskOrActionPageComponent,
    MandateSummaryTemplateComponent,
    ReviewDecisionSummaryTemplateComponent,
    VariationRegulatorDecisionPartialSummaryTemplateComponent,
  ],
  standalone: true,
  templateUrl: './emp-var-submitted-mandate.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmpVarSubmittedMandateComponent {
  private readonly store: RequestActionStore = inject(RequestActionStore);
  private readonly authStore: AuthStore = inject(AuthStore);

  readonly mandateMap = mandateMap;
  readonly mandate = this.store.select(empVariationSubmittedQuery.selectMandate)();
  readonly operatorName = this.store.select(empVariationSubmittedQuery.selectOperatorDetails)()?.operatorName;
  public readonly isVariationRegulator = this.store.select(empVariationSubmittedQuery.selectIsVariationRegulator);
  public readonly reviewGroupDecision = computed(() => {
    if (this.isVariationRegulator()) {
      return undefined;
    }

    return this.store.select(empVariationSubmittedQuery.selectReviewGroupDecision('mandate'))();
  });

  public readonly regulatorLedReason = this.store.select(
    empVariationSubmittedQuery.selectVariationRegulatorDecisionDetails('mandate'),
  );

  public readonly isRegulator = computed(() => this.authStore.select(selectUserRoleType)() === 'REGULATOR');
}
