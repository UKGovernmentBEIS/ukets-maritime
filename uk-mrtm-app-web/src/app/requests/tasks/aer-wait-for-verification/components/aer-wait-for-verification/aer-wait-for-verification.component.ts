import { ChangeDetectionStrategy, Component } from '@angular/core';

import { WarningTextComponent } from '@netz/govuk-components';

@Component({
  selector: 'mrtm-aer-wait-for-verification',
  imports: [WarningTextComponent],
  standalone: true,
  templateUrl: './aer-wait-for-verification.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AerWaitForVerificationComponent {}
