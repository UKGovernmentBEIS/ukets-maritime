import { ChangeDetectionStrategy, Component } from '@angular/core';

import { WarningTextComponent } from '@netz/govuk-components';

@Component({
  selector: 'mrtm-aer-wait-for-review',
  imports: [WarningTextComponent],
  standalone: true,
  templateUrl: './aer-wait-for-review.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AerWaitForReviewComponent {}
