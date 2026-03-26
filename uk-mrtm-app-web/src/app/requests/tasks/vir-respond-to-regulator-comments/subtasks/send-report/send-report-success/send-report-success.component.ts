import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { LinkDirective, PanelComponent } from '@netz/govuk-components';

@Component({
  selector: 'mrtm-send-report-success',
  imports: [LinkDirective, RouterLink, PanelComponent],
  standalone: true,
  templateUrl: './send-report-success.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SendReportSuccessComponent {}
