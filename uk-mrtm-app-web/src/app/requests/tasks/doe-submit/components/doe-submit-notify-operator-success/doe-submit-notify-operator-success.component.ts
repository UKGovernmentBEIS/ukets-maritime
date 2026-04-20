import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { LinkDirective, PanelComponent } from '@netz/govuk-components';

@Component({
  selector: 'mrtm-doe-submit-notify-operator-success',
  standalone: true,
  imports: [RouterLink, LinkDirective, PanelComponent],
  templateUrl: './doe-submit-notify-operator-success.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DoeSubmitNotifyOperatorSuccessComponent {}
