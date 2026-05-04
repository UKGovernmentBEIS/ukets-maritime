import { ChangeDetectionStrategy, Component, inject, Signal } from '@angular/core';

import { RequestActionStore } from '@netz/common/store';

import { empPeerReviewDecisionQuery } from '@requests/timeline/emp-peer-review-decision/+state';
import { EmpPeerReviewDecisionSummaryTemplateComponent } from '@shared/components';
import { EmpPeerReviewDecisionDto } from '@shared/types';

@Component({
  selector: 'mrtm-emp-peer-review-decision',
  imports: [EmpPeerReviewDecisionSummaryTemplateComponent],
  standalone: true,
  templateUrl: './emp-peer-review-decision.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmpPeerReviewDecisionComponent {
  private readonly store: RequestActionStore = inject(RequestActionStore);
  public readonly vm: Signal<EmpPeerReviewDecisionDto> = this.store.select(
    empPeerReviewDecisionQuery.selectPeerReviewDecisionDto,
  );
}
