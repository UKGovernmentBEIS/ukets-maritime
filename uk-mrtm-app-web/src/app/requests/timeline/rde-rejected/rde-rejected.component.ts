import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { RdeRejectedRequestActionPayload } from '@mrtm/api';

import { requestActionQuery, RequestActionStore } from '@netz/common/store';

import { RdeRejectedSummaryTemplateComponent } from '@shared/components';

@Component({
  selector: 'mrtm-rde-rejected',
  imports: [RdeRejectedSummaryTemplateComponent],
  standalone: true,
  templateUrl: './rde-rejected.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RdeRejectedComponent {
  private readonly store = inject(RequestActionStore);
  readonly payload = this.store.select(requestActionQuery.selectActionPayload)() as RdeRejectedRequestActionPayload;
}
