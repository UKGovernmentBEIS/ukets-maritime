import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { LinkDirective, PanelComponent } from '@netz/govuk-components';

@Component({
  selector: 'mrtm-send-report-success',
  imports: [RouterLink, PanelComponent, LinkDirective],
  standalone: true,
  templateUrl: './send-report-success.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SendReportSuccessComponent {}
