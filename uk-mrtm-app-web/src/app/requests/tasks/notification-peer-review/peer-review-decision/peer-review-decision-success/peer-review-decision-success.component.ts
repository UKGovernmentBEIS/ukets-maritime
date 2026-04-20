import { ChangeDetectionStrategy, Component, inject, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';

import { LinkDirective, PanelComponent } from '@netz/govuk-components';

import { PeerReviewStore } from '@requests/tasks/notification-peer-review/+state/peer-review.store';

@Component({
  selector: 'mrtm-peer-review-decision-success',
  standalone: true,
  imports: [PanelComponent, RouterLink, LinkDirective],
  templateUrl: './peer-review-decision-success.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PeerReviewDecisionSuccessComponent implements OnDestroy {
  private readonly store = inject(PeerReviewStore);

  ngOnDestroy(): void {
    this.store.reset();
  }
}
