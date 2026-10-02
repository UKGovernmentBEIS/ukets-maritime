import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { AuthStore, selectUserRoleType } from '@netz/common/auth';
import { PageHeadingComponent, ReturnToTaskOrActionPageComponent } from '@netz/common/components';
import { RequestActionStore } from '@netz/common/store';

import { empSubmittedQuery } from '@requests/timeline/emp-submitted/+state';
import {
  ListOfShipsSummaryTemplateComponent,
  ReviewDecisionSummaryTemplateComponent,
} from '@shared/components/summaries';

@Component({
  selector: 'mrtm-list-of-ships-submitted',
  imports: [
    PageHeadingComponent,
    ListOfShipsSummaryTemplateComponent,
    ReturnToTaskOrActionPageComponent,
    ReviewDecisionSummaryTemplateComponent,
  ],
  standalone: true,
  templateUrl: './list-of-ships-summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListOfShipsSummaryComponent {
  private readonly store: RequestActionStore = inject(RequestActionStore);
  private readonly authStore = inject(AuthStore);
  protected readonly isRegulator = computed(() => this.authStore.select(selectUserRoleType)() === 'REGULATOR');
  public readonly ships = this.store.select(empSubmittedQuery.selectListOfShips)();
  public readonly reviewGroupDecision = this.store.select(empSubmittedQuery.selectReviewGroupDecision('emissions'));
}
