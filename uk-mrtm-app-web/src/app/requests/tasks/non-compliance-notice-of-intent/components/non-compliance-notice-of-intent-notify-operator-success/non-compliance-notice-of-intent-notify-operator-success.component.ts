import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { LinkDirective, PanelComponent } from '@netz/govuk-components';

@Component({
  selector: 'mrtm-non-compliance-notice-of-intent-notify-operator-success',
  imports: [RouterLink, LinkDirective, PanelComponent],
  standalone: true,
  templateUrl: './non-compliance-notice-of-intent-notify-operator-success.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NonComplianceNoticeOfIntentNotifyOperatorSuccessComponent {}
