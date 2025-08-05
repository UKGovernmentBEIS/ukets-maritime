import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { LinkDirective, PanelComponent } from '@netz/govuk-components';

@Component({
  selector: 'mrtm-send-report-success-message',
  standalone: true,
  imports: [PanelComponent, RouterLink, LinkDirective],
  templateUrl: './send-report-success-message.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SendReportSuccessMessageComponent {}
