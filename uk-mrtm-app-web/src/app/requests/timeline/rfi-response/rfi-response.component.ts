import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { RequestActionStore } from '@netz/common/store';
import { LinkDirective } from '@netz/govuk-components';

import { rfiResponseQuery } from '@requests/timeline/rfi-response/+state';
import { RfiResponseSummaryTemplateComponent } from '@shared/components';

@Component({
  selector: 'mrtm-rfi-response',
  standalone: true,
  imports: [RfiResponseSummaryTemplateComponent, LinkDirective, RouterLink],
  templateUrl: './rfi-response.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RfiResponseComponent {
  private readonly store = inject(RequestActionStore);
  readonly rfiResponseData = this.store.select(rfiResponseQuery.selectRfiResponseData);
}
