import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { PageHeadingComponent } from '@netz/common/components';
import { GovukDatePipe } from '@netz/common/pipes';

@Component({
  selector: 'mrtm-request-action-heading',
  imports: [PageHeadingComponent, GovukDatePipe],
  standalone: true,
  template: `
    <netz-page-heading>{{ headerText() }}</netz-page-heading>
    <p class="govuk-caption-m">{{ timelineCreationDate() | govukDate: 'datetime' }}</p>
    <ng-content />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequestActionHeadingComponent {
  readonly headerText = input<string>();
  readonly timelineCreationDate = input<string>();
}
