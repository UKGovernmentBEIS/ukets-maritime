import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { RequestActionStore } from '@netz/common/store';

import { registryNoticeEventSubmittedQuery } from '@requests/timeline/registry-notice-event-submitted/+state';
import { RegistryNoticeEventSubmittedSummaryTemplateComponent } from '@shared/components';

@Component({
  selector: 'mrtm-registry-notice-event-submitted',
  imports: [RegistryNoticeEventSubmittedSummaryTemplateComponent],
  template: `
    <mrtm-registry-notice-event-submitted-summary-template [data]="data()" />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistryNoticeEventSubmittedComponent {
  private readonly store = inject(RequestActionStore);

  public readonly data = this.store.select(registryNoticeEventSubmittedQuery.selectRegistryNoticeEventPayload);
}
