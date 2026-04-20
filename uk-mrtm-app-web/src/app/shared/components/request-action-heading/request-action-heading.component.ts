import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { PageHeadingComponent } from '@netz/common/components';
import { GovukDatePipe } from '@netz/common/pipes';

@Component({
  selector: 'mrtm-request-action-heading',
  template: `
    <netz-page-heading>{{ headerText }}</netz-page-heading>
    <p class="govuk-caption-m">{{ timelineCreationDate | govukDate: 'datetime' }}</p>
    <ng-content></ng-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [PageHeadingComponent, GovukDatePipe],
})
export class RequestActionHeadingComponent {
  @Input() headerText: string;
  @Input() timelineCreationDate: string;
}
