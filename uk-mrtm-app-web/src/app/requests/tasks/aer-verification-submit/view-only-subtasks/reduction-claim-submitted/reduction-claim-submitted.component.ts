import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { PageHeadingComponent, ReturnToTaskOrActionPageComponent } from '@netz/common/components';
import { RequestTaskStore } from '@netz/common/store';

import { aerCommonQuery } from '@requests/common/aer/+state';
import { reductionClaimMap } from '@requests/common/aer/subtasks/reduction-claim';
import {
  ReductionClaimDetailsSummaryTemplateComponent,
  ReductionClaimSummaryTemplateComponent,
} from '@shared/components';

@Component({
  selector: 'mrtm-reduction-claim-submitted',
  standalone: true,
  imports: [
    ReturnToTaskOrActionPageComponent,
    PageHeadingComponent,
    ReductionClaimSummaryTemplateComponent,
    ReductionClaimDetailsSummaryTemplateComponent,
  ],
  templateUrl: './reduction-claim-submitted.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReductionClaimSubmittedComponent {
  private readonly store = inject(RequestTaskStore);
  public readonly map = reductionClaimMap;
  public readonly data = this.store.select(aerCommonQuery.selectReductionClaim);
  public readonly fuelPurchases = this.store.select(aerCommonQuery.selectReductionClaimDetailsListItems);
}
