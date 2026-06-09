import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { RequestActionStore } from '@netz/common/store';

import { rdeSubmittedQuery } from '@requests/timeline/rde-submitted/+state';
import { RdeSubmittedSummaryTemplateComponent } from '@shared/components';

@Component({
  selector: 'mrtm-rde-submitted',
  imports: [RdeSubmittedSummaryTemplateComponent],
  standalone: true,
  template: '<mrtm-rde-submitted-summary-template [data]="rdeData()" />',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RdeSubmittedComponent {
  private readonly store = inject(RequestActionStore);
  readonly rdeData = this.store.select(rdeSubmittedQuery.selectRdeData);
}
