import { ChangeDetectionStrategy, Component } from '@angular/core';

import { WarningTextComponent } from '@netz/govuk-components';

@Component({
  selector: 'mrtm-wait-for-peer-review',
  standalone: true,
  imports: [WarningTextComponent],
  template: `
    <govuk-warning-text [assistiveText]="null">
      Waiting for peer review, you cannot make any changes.
    </govuk-warning-text>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WaitForPeerReviewComponent {}
