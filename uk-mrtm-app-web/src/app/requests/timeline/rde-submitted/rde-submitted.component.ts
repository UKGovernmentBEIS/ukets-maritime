import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { RequestActionStore } from '@netz/common/store';
import { LinkDirective } from '@netz/govuk-components';

import { rdeSubmittedQuery } from '@requests/timeline/rde-submitted/+state';
import { RdeSubmittedSummaryTemplateComponent } from '@shared/components';

@Component({
  selector: 'mrtm-rde-submitted',
  imports: [RdeSubmittedSummaryTemplateComponent, LinkDirective, RouterLink],
  standalone: true,
  templateUrl: './rde-submitted.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RdeSubmittedComponent {
  private readonly store = inject(RequestActionStore);
  readonly rdeData = this.store.select(rdeSubmittedQuery.selectRdeData);
}
