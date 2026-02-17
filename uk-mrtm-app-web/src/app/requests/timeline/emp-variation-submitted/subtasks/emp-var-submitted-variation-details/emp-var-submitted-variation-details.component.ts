import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { AuthStore, selectUserRoleType } from '@netz/common/auth';
import { PageHeadingComponent, ReturnToTaskOrActionPageComponent } from '@netz/common/components';
import { RequestActionStore } from '@netz/common/store';

import { variationDetailsSubtaskMap } from '@requests/common/emp/subtasks/subtask-list.map';
import { empVariationSubmittedQuery } from '@requests/timeline/emp-variation-submitted/+state';
import { ReviewDecisionSummaryTemplateComponent, VariationDetailsSummaryTemplateComponent } from '@shared/components';

@Component({
  selector: 'mrtm-emp-var-submitted-variation-details',
  imports: [
    VariationDetailsSummaryTemplateComponent,
    PageHeadingComponent,
    ReturnToTaskOrActionPageComponent,
    ReviewDecisionSummaryTemplateComponent,
  ],
  standalone: true,
  templateUrl: './emp-var-submitted-variation-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmpVarSubmittedVariationDetailsComponent {
  private readonly store = inject(RequestActionStore);
  private readonly authStore = inject(AuthStore);

  isRegulator = this.authStore.select(selectUserRoleType)() === 'REGULATOR';
  variationDetails = this.store.select(empVariationSubmittedQuery.selectEmpVariationDetails)();
  isVariationRegulator = this.store.select(empVariationSubmittedQuery.selectIsVariationRegulator)();
  regulatorLedReason = this.store.select(empVariationSubmittedQuery.selectReasonRegulatorLed)();
  reviewGroupDecision = this.store.select(empVariationSubmittedQuery.selectEmpVariationDetailsReviewDecisionDTO)();
  title = variationDetailsSubtaskMap.title;
}
