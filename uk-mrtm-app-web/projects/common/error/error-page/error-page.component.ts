import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { PageHeadingComponent } from '@netz/common/components';

@Component({
  selector: 'netz-error-page',
  imports: [PageHeadingComponent],
  standalone: true,
  template: `
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-two-thirds">
        <netz-page-heading>{{ heading() }}</netz-page-heading>
        <ng-content />
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorPageComponent {
  readonly heading = input<string>();
}
