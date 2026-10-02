import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { AuthStore, selectUserRoleType } from '@netz/common/auth';
import { PageHeadingComponent, ReturnToTaskOrActionPageComponent } from '@netz/common/components';
import { RequestActionStore } from '@netz/common/store';

import { mandateMap } from '@requests/common/emp/subtasks/subtask-list.map';
import { empSubmittedQuery } from '@requests/timeline/emp-submitted/+state';
import { MandateSummaryTemplateComponent, ReviewDecisionSummaryTemplateComponent } from '@shared/components';

@Component({
  selector: 'mrtm-mandate-submitted',
  imports: [
    PageHeadingComponent,
    ReturnToTaskOrActionPageComponent,
    MandateSummaryTemplateComponent,
    ReviewDecisionSummaryTemplateComponent,
  ],
  standalone: true,
  templateUrl: './mandate-submitted.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MandateSubmittedComponent {
  private readonly store: RequestActionStore = inject(RequestActionStore);
  private readonly authStore = inject(AuthStore);
  protected readonly isRegulator = computed(() => this.authStore.select(selectUserRoleType)() === 'REGULATOR');

  readonly mandateMap = mandateMap;
  readonly mandate = this.store.select(empSubmittedQuery.selectMandate);
  readonly operatorName = this.store.select(empSubmittedQuery.selectOperatorDetails)()?.operatorName;
  readonly reviewGroupDecision = this.store.select(empSubmittedQuery.selectReviewGroupDecision('mandate'));
}
