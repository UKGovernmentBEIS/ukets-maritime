import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { RequestActionStore } from '@netz/common/store';

import { rfiResponseQuery } from '@requests/timeline/rfi-response/+state';
import { RfiResponseSummaryTemplateComponent } from '@shared/components';

@Component({
  selector: 'mrtm-rfi-response',
  imports: [RfiResponseSummaryTemplateComponent],
  standalone: true,
  template: '<mrtm-rfi-response-summary-template [data]="rfiResponseData()" />',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RfiResponseComponent {
  private readonly store = inject(RequestActionStore);
  readonly rfiResponseData = this.store.select(rfiResponseQuery.selectRfiResponseData);
}
