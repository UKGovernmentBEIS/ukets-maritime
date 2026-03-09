import { ChangeDetectionStrategy, Component, computed, inject, Signal } from '@angular/core';

import { RequestActionStore } from '@netz/common/store';

import { followUpResponseSubmittedQuery } from '@requests/timeline/follow-up-response-submitted/+state';
import { FollowUpResponseSummaryTemplateComponent } from '@shared/components';
import { FollowUpResponse } from '@shared/types';

@Component({
  selector: 'mrtm-follow-up-response-submitted',
  standalone: true,
  imports: [FollowUpResponseSummaryTemplateComponent],
  templateUrl: './follow-up-response-submitted.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FollowUpResponseSubmittedComponent {
  private readonly store = inject(RequestActionStore);

  vm: Signal<FollowUpResponse> = computed(() => {
    return {
      request: this.store.select(followUpResponseSubmittedQuery.selectPayload)().request,
      response: this.store.select(followUpResponseSubmittedQuery.selectPayload)().response,
      attachments: this.store.select(
        followUpResponseSubmittedQuery.selectAttachedFiles(
          this.store.select(followUpResponseSubmittedQuery.selectResponseFiles)(),
        ),
      )(),
    };
  });
}
