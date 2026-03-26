import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { LinkDirective, PanelComponent } from '@netz/govuk-components';

@Component({
  selector: 'mrtm-doe-submit-notify-operator-success',
  imports: [RouterLink, LinkDirective, PanelComponent],
  standalone: true,
  templateUrl: './doe-submit-notify-operator-success.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DoeSubmitNotifyOperatorSuccessComponent {}
