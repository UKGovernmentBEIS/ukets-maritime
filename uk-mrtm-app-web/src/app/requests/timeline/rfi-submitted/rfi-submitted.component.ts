import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { RequestActionStore } from '@netz/common/store';
import { LinkDirective } from '@netz/govuk-components';

import { rfiSubmittedQuery } from '@requests/timeline/rfi-submitted/+state';
import { RfiSubmittedSummaryTemplateComponent } from '@shared/components';

@Component({
  selector: 'mrtm-rfi-submitted',
  imports: [RfiSubmittedSummaryTemplateComponent, LinkDirective, RouterLink],
  standalone: true,
  templateUrl: './rfi-submitted.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RfiSubmittedComponent {
  private readonly store = inject(RequestActionStore);
  readonly rfiSubmittedData = this.store.select(rfiSubmittedQuery.selectRfiSubmittedData);
}
