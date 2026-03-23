import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { LinkDirective, PanelComponent } from '@netz/govuk-components';

@Component({
  selector: 'mrtm-send-report-success',
  standalone: true,
  imports: [RouterLink, PanelComponent, LinkDirective],
  templateUrl: './send-report-success.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SendReportSuccessComponent {}
