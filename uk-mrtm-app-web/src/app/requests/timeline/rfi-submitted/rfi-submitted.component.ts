import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { RequestActionStore } from '@netz/common/store';

import { rfiSubmittedQuery } from '@requests/timeline/rfi-submitted/+state';
import { RfiSubmittedSummaryTemplateComponent } from '@shared/components';

@Component({
  selector: 'mrtm-rfi-submitted',
  imports: [RfiSubmittedSummaryTemplateComponent],
  standalone: true,
  template: '<mrtm-rfi-submitted-summary-template [data]="rfiSubmittedData()" />',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RfiSubmittedComponent {
  private readonly store = inject(RequestActionStore);
  readonly rfiSubmittedData = this.store.select(rfiSubmittedQuery.selectRfiSubmittedData);
}
