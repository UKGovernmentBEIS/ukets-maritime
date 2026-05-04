import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { RequestActionStore } from '@netz/common/store';

import { followUpReturnedForAmendsQuery } from '@requests/timeline/follow-up-returned-for-amends/+state';
import { FollowUpReturnedForAmendsSummaryTemplateComponent } from '@shared/components';

@Component({
  selector: 'mrtm-follow-up-returned-for-amends',
  imports: [FollowUpReturnedForAmendsSummaryTemplateComponent],
  standalone: true,
  templateUrl: './follow-up-returned-for-amends.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FollowUpReturnedForAmendsComponent {
  private readonly store = inject(RequestActionStore);
  readonly followUpReturnedAmends = this.store.select(followUpReturnedForAmendsQuery.selectFollowUpReturnedAmends)();
}
